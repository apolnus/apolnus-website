import express, { Request, Response } from 'express';
import { google } from 'googleapis';
import axios from 'axios';
import { ENV } from './env';
import { authService } from './auth-service';

export const authRouter = express.Router();

// =============================================================================
// GOOGLE OAuth Setup
// =============================================================================

const googleClient = new google.auth.OAuth2(
  ENV.googleClientId,
  ENV.googleClientSecret,
  `${ENV.baseUrl}/api/auth/google/callback`
);

/**
 * Google OAuth - Initiate login
 * GET /api/auth/google?redirect=/path
 */
authRouter.get('/api/auth/google', (req: Request, res: Response) => {
  try {
    const redirectPath = req.query.redirect?.toString() || '/';
    const state = Buffer.from(redirectPath).toString('base64');

    const url = googleClient.generateAuthUrl({
      access_type: 'online',
      scope: ['profile', 'email'],
      state: state,
      prompt: 'select_account'
    });

    console.log('[Auth] Google OAuth initiated, redirect:', redirectPath);
    res.redirect(url);
  } catch (error: any) {
    console.error('[Auth] Google OAuth init error:', error.message);
    res.redirect('/login?error=google_init_failed');
  }
});

/**
 * Google OAuth - Callback handler
 * GET /api/auth/google/callback?code=...&state=...
 */
authRouter.get('/api/auth/google/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirectPath = state ? Buffer.from(state.toString(), 'base64').toString() : '/';

  console.log('[Auth] Google callback received');

  try {
    // Validate required parameters
    if (!code) {
      throw new Error('Missing authorization code');
    }

    // Step 1: Exchange code for tokens
    console.log('[Auth] Exchanging Google code for tokens...');
    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);

    // Step 2: Get user info
    console.log('[Auth] Fetching Google user info...');
    const oauth2 = google.oauth2({ version: 'v2', auth: googleClient });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Step 3: Validate user info
    if (!userInfo.id || !userInfo.email) {
      throw new Error('Invalid Google user info: missing id or email');
    }

    console.log('[Auth] Google user info received:', {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name
    });

    // Step 4: Handle login (upsert DB + create session)
    await authService.handleUserLogin(req, res, {
      openId: `google_${userInfo.id}`,
      name: userInfo.name || 'Google User',
      email: userInfo.email,
      avatar: userInfo.picture || '',
      loginMethod: 'google'
    });

    console.log('[Auth] ✓ Google login completed successfully');
    res.redirect(redirectPath);
  } catch (error: any) {
    const errorRedirect = authService.createErrorRedirect('google', error, redirectPath);
    res.redirect(errorRedirect);
  }
});

// =============================================================================
// LINE OAuth Setup
// =============================================================================

/**
 * LINE OAuth - Initiate login
 * GET /api/auth/line?redirect=/path
 */
authRouter.get('/api/auth/line', (req: Request, res: Response) => {
  try {
    const redirectPath = req.query.redirect?.toString() || '/';
    const state = Buffer.from(redirectPath).toString('base64');
    const nonce = Math.random().toString(36).substring(7);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: ENV.lineChannelId,
      redirect_uri: `${ENV.baseUrl}/api/auth/line/callback`,
      state: state,
      scope: 'profile openid email',
      nonce: nonce
    });

    console.log('[Auth] LINE OAuth initiated, redirect:', redirectPath);
    res.redirect(`https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`);
  } catch (error: any) {
    console.error('[Auth] LINE OAuth init error:', error.message);
    res.redirect('/login?error=line_init_failed');
  }
});

/**
 * LINE OAuth - Callback handler
 * GET /api/auth/line/callback?code=...&state=...
 */
authRouter.get('/api/auth/line/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const redirectPath = state ? Buffer.from(state.toString(), 'base64').toString() : '/';

  console.log('[Auth] LINE callback received');

  try {
    // Validate required parameters
    if (!code) {
      throw new Error('Missing authorization code');
    }

    // Step 1: Exchange code for tokens
    console.log('[Auth] Exchanging LINE code for tokens...');
    const tokenRes = await axios.post(
      'https://api.line.me/oauth2/v2.1/token',
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
    if (!id_token) {
      throw new Error('Missing id_token in LINE response');
    }

    // Step 2: Decode ID token (simple base64 decode, no verification for simplicity)
    // In production, you should verify the JWT signature
    console.log('[Auth] Decoding LINE ID token...');
    const payload = JSON.parse(
      Buffer.from(id_token.split('.')[1], 'base64').toString()
    );

    // Step 3: Validate user info
    if (!payload.sub || !payload.name) {
      throw new Error('Invalid LINE user info: missing sub or name');
    }

    console.log('[Auth] LINE user info received:', {
      sub: payload.sub,
      name: payload.name,
      email: payload.email || 'N/A'
    });

    // Step 4: Handle login (upsert DB + create session)
    await authService.handleUserLogin(req, res, {
      openId: `line_${payload.sub}`,
      name: payload.name,
      email: payload.email || null,
      avatar: payload.picture || '',
      loginMethod: 'line'
    });

    console.log('[Auth] ✓ LINE login completed successfully');
    res.redirect(redirectPath);
  } catch (error: any) {
    const errorRedirect = authService.createErrorRedirect('line', error, redirectPath);
    res.redirect(errorRedirect);
  }
});

// =============================================================================
// Logout
// =============================================================================

/**
 * Logout endpoint
 * GET /api/auth/logout
 */
authRouter.get('/api/auth/logout', (req: Request, res: Response) => {
  try {
    authService.handleUserLogout(req, res);
    res.redirect('/login?message=logged_out');
  } catch (error: any) {
    console.error('[Auth] Logout error:', error.message);
    res.redirect('/login?error=logout_failed');
  }
});

