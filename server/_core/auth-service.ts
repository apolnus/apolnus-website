import { Request, Response } from 'express';
import { sdk } from './sdk';
import { upsertUser } from '../db';
import { COOKIE_NAME, ONE_YEAR_MS } from '@shared/const';
import { getSessionCookieOptions } from './cookies';

/**
 * User data structure for authentication
 */
export interface AuthUserData {
    openId: string;
    name: string;
    email?: string | null;
    avatar?: string;
    loginMethod: 'google' | 'line';
}

/**
 * Centralized authentication service
 */
export class AuthService {
    /**
     * Handle complete user login flow:
     * 1. Upsert user to database
     * 2. Create session token
     * 3. Set session cookie
     */
    async handleUserLogin(
        req: Request,
        res: Response,
        userData: AuthUserData
    ): Promise<void> {
        console.log('[Auth] Starting login process for:', userData.openId);

        try {
            // Step 1: Upsert user to database
            await upsertUser({
                openId: userData.openId,
                name: userData.name,
                email: userData.email || null,
                avatar: userData.avatar || null,
                loginMethod: userData.loginMethod,
                lastSignedIn: new Date()
            });

            // Step 2: Create session token
            const sessionToken = await sdk.createSessionToken(userData.openId, {
                name: userData.name,
                expiresInMs: ONE_YEAR_MS,
            });

            // Step 3: Set session cookie
            const cookieOptions = getSessionCookieOptions(req);
            res.cookie(COOKIE_NAME, sessionToken, {
                ...cookieOptions,
                maxAge: ONE_YEAR_MS
            });

            console.log('[Auth] ✓ Login successful:', userData.openId);
        } catch (error: any) {
            console.error('[Auth] ✗ Login failed:', {
                openId: userData.openId,
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Handle user logout:
     * 1. Clear session cookie
     */
    handleUserLogout(req: Request, res: Response): void {
        console.log('[Auth] Logging out user');
        const cookieOptions = getSessionCookieOptions(req);
        res.clearCookie(COOKIE_NAME, cookieOptions);
        console.log('[Auth] ✓ Logout successful');
    }

    /**
     * Create error redirect URL with detailed error information
     */
    createErrorRedirect(
        provider: 'google' | 'line',
        error: any,
        originalRedirect: string = '/'
    ): string {
        const errorCode = error.code || 'unknown';
        const errorMessage = error.sqlMessage || error.message || 'Authentication failed';

        console.error(`[Auth] ${provider} login error:`, {
            code: errorCode,
            message: errorMessage,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        });

        const params = new URLSearchParams({
            error: `${provider}_failed`,
            code: errorCode,
            message: errorMessage,
            redirect: originalRedirect
        });

        return `/login?${params.toString()}`;
    }
}

export const authService = new AuthService();
