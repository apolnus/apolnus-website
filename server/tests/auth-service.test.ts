import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../_core/auth-service';
import * as db from '../db';
import { Response, Request } from 'express';
import { COOKIE_NAME } from '@shared/const';

// Mock dependencies
vi.mock('../db', () => ({
    upsertUser: vi.fn(),
}));

// Mock sdk
vi.mock('../_core/sdk', () => ({
    sdk: {
        createSessionToken: vi.fn(),
    }
}));

import { sdk } from '../_core/sdk';

describe('AuthService', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockReq = {
            headers: {},
            protocol: 'http',
        };
        mockRes = {
            cookie: vi.fn(),
            clearCookie: vi.fn(),
        };
    });

    describe('handleUserLogin', () => {
        it('should upsert user, create session token, and set cookie', async () => {
            const userData = {
                openId: 'test_openid',
                name: 'Test User',
                email: 'test@example.com',
                avatar: 'avatarapi',
                loginMethod: 'google' as const
            };

            (sdk.createSessionToken as any).mockResolvedValue('mock-token');

            await authService.handleUserLogin(mockReq as Request, mockRes as Response, userData);

            expect(db.upsertUser).toHaveBeenCalledWith(expect.objectContaining({
                openId: 'test_openid',
                name: 'Test User',
                email: 'test@example.com'
            }));

            expect(sdk.createSessionToken).toHaveBeenCalledWith(
                'test_openid',
                expect.objectContaining({ name: 'Test User' })
            );

            expect(mockRes.cookie).toHaveBeenCalledWith(
                COOKIE_NAME,
                'mock-token',
                expect.objectContaining({
                    httpOnly: true,
                    secure: false, // http protocol mocked
                    sameSite: 'none'
                })
            );
        });
    });

    describe('handleUserLogout', () => {
        it('should clear the session cookie', () => {
            authService.handleUserLogout(mockReq as Request, mockRes as Response);

            expect(mockRes.clearCookie).toHaveBeenCalledWith(
                COOKIE_NAME,
                expect.objectContaining({
                    httpOnly: true,
                    path: '/'
                })
            );
        });
    });

    describe('createErrorRedirect', () => {
        it('should create correct error URL with encoded params', () => {
            const error = { code: 'DB_ERR', message: 'Database error' };
            const url = authService.createErrorRedirect('google', error);

            expect(url).toContain('/login?');
            expect(url).toContain('error=google_failed');
            expect(url).toContain('code=DB_ERR');
            expect(url).toContain('message=Database+error');
        });

        it('should handle missing error details', () => {
            const error = {};
            const url = authService.createErrorRedirect('google', error);

            expect(url).toContain('code=unknown');
            expect(url).toContain('message=Authentication+failed');
        });
    });
});
