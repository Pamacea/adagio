// ============================================================================
// BETTER AUTH CONTROLLER - NestJS Integration
// ============================================================================

import { Controller, All, Req, Res, Header, Logger } from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { auth } from '@adagio/auth/server';

/**
 * Better Auth Controller
 *
 * This controller proxies all Better Auth requests to the Better Auth handler.
 * All auth endpoints are available under /api/v1/auth/*
 *
 * Endpoints include:
 * - POST   /api/v1/auth/sign-up/email     - Register with email/password
 * - POST   /api/v1/auth/sign-in/email     - Login with email/password
 * - POST   /api/v1/auth/sign-out          - Logout
 * - GET    /api/v1/auth/get-session       - Get current session
 * - POST   /api/v1/auth/reset-password    - Request password reset
 * - GET    /api/v1/auth/oauth/*           - OAuth flows
 */
@Controller('v1/auth')
export class BetterAuthController {
  private readonly logger = new Logger(BetterAuthController.name);

  /**
   * Convert Express Request to Web Standard Request
   */
  private toWebRequest(req: ExpressRequest): globalThis.Request {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    // Build headers from Express request
    const headers = new Headers();
    Object.keys(req.headers).forEach(key => {
      const value = req.headers[key];
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      }
    });

    // Build request
    const init: RequestInit = {
      method: req.method,
      headers,
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (req.body) {
        init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }
    }

    return new Request(url, init);
  }

  /**
   * Proxy all requests to Better Auth handler
   */
  @All('*')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  async proxy(@Req() req: ExpressRequest, @Res() res: Response) {
    this.logger.debug(`${req.method} ${req.originalUrl || req.path}`);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    try {
      // Convert Express request to Web Standard request
      const webRequest = this.toWebRequest(req);

      // Call Better Auth handler
      const webResponse = await auth.handler(webRequest);

      // Copy response headers
      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Set status
      res.status(webResponse.status);

      // Send body
      const body = await webResponse.text();
      res.send(body);

      return res;
    } catch (error) {
      this.logger.error('Better Auth error', error);
      return res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while processing the request',
        },
      });
    }
  }
}
