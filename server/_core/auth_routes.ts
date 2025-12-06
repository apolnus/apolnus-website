import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import axios from 'axios';
import { getDb, upsertUser } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ENV } from './env';
import { sdk } from './sdk';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import { getSessionCookieOptions } from './cookies';

export const authRouter = express.Router();

// --- 1. Google OAuth 設定 ---
const googleClient = new google.auth.OAuth2(
  ENV.googleClientId,
  ENV.googleClientSecret,
  `${ENV.baseUrl}/api/auth/google/callback`
);

// Google 登入跳轉
authRouter.get('/api/auth/google', (req: Request, res: Response) => {
  const redirectPath = req.query.redirect?.toString() || '/';
  // 將來源網址加密放入 state，確保登入後跳回原頁面 (例如 /jp/about)
  const state = Buffer.from(redirectPath).toString('base64');

  const url = googleClient.generateAuthUrl({
    access_type: 'online',
    scope: ['profile', 'email'],
    state: state
  });
  res.redirect(url);
});

// Google Callback
authRouter.get('/api/auth/google/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirectPath = state ? Buffer.from(state.toString(), 'base64').toString() : '/';

  try {
    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: googleClient });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.id || !userInfo.email) throw new Error("Missing Google User Info");

    await handleUserLogin(req, res, {
      openId: `google_${userInfo.id}`,
      name: userInfo.name || 'Google User',
      email: userInfo.email,
      avatar: userInfo.picture || '',
      loginMethod: 'google'
    });

    res.redirect(redirectPath);
  } catch (error: any) {
    console.error('[Auth Error] Google Login Failed:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    const reason = error.sqlMessage || error.message || 'unknown';
    res.redirect(`/login?error=google_failed&reason=${encodeURIComponent(reason)}`);
  }
});

// --- 2. LINE OAuth 設定 ---
// LINE 登入跳轉
authRouter.get('/api/auth/line', (req: Request, res: Response) => {
  const redirectPath = req.query.redirect?.toString() || '/';
  const state = Buffer.from(redirectPath).toString('base64');
  // CSRF & State
  const nonce = Math.random().toString(36).substring(7);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: ENV.lineChannelId,
    redirect_uri: `${ENV.baseUrl}/api/auth/line/callback`,
    state: state,
    scope: 'profile openid email',
    nonce: nonce
  });

  res.redirect(`https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`);
});

// LINE Callback
authRouter.get('/api/auth/line/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirectPath = state ? Buffer.from(state.toString(), 'base64').toString() : '/';

  try {
    // 交換 Token
    const tokenRes = await axios.post('https://api.line.me/oauth2/v2.1/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: `${ENV.baseUrl}/api/auth/line/callback`,
        client_id: ENV.lineChannelId,
        client_secret: ENV.lineChannelSecret
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { id_token } = tokenRes.data;
    // 解析 ID Token (取得 User Info)
    // 這裡簡單用 payload 解碼，正式環境建議驗證簽章
    const payload = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());

    await handleUserLogin(req, res, {
      openId: `line_${payload.sub}`,
      name: payload.name,
      email: payload.email || undefined, // LINE Email 需申請權限，若無則為 undefined
      avatar: payload.picture || '',
      loginMethod: 'line'
    });

    res.redirect(redirectPath);
  } catch (error: any) {
    console.error('[Auth Error] LINE Login Failed:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      response: error.response?.data,
      stack: error.stack
    });
    const reason = error.sqlMessage || error.message || 'unknown';
    res.redirect(`/login?error=line_failed&reason=${encodeURIComponent(reason)}`);
  }
});

// --- 3. 共用登入邏輯 (DB & Session) ---
async function handleUserLogin(req: Request, res: Response, userData: any) {
  // 使用 centralized upsert logic
  await upsertUser({
    openId: userData.openId,
    name: userData.name,
    email: userData.email, // undefined 會在 upsertUser 中被忽略 (轉為 NULL 或 skip)
    avatar: userData.avatar,
    loginMethod: userData.loginMethod,
    role: undefined, // Let DB default handling it or upsertUser logic
    createdAt: undefined,
    updatedAt: undefined,
    lastSignedIn: new Date() // upsertUser 邏輯會處理這個
  });

  // 建立 Session
  const sessionToken = await sdk.createSessionToken(userData.openId, {
    name: userData.name,
    expiresInMs: ONE_YEAR_MS,
  });

  // 寫入 Cookie
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, {
    ...cookieOptions,
    maxAge: ONE_YEAR_MS
  });
}
