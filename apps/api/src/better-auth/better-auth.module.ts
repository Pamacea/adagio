// ============================================================================
// BETTER AUTH MODULE - NestJS Integration
// ============================================================================

import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BetterAuthController } from './better-auth.controller';

/**
 * Better Auth Module
 *
 * This module integrates Better Auth with NestJS.
 * It provides authentication endpoints and configuration.
 */
@Global()
@Module({
  controllers: [BetterAuthController],
  providers: [
    {
      provide: 'BETTER_AUTH_CONFIG',
      useFactory: (config: ConfigService) => ({
        url: config.get<string>('BETTER_AUTH_URL') || config.get<string>('API_URL') || 'http://localhost:3001',
        appId: config.get<string>('BETTER_AUTH_APP_ID') || 'adagio',
      }),
      inject: [ConfigService],
    },
  ],
  exports: ['BETTER_AUTH_CONFIG'],
})
export class BetterAuthModule {}
