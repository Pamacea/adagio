import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { BetterAuthModule } from './better-auth';
import { TheoryModule } from './theory/theory.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';
import { ProgressModule } from './progress/progress.module';
import { ColorModule } from './color/color.module';
import { LessonsModule } from './lessons/lessons.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      // Le .env racine est la source unique du monorepo (l'API tourne depuis apps/api).
      envFilePath: ['.env.local', '.env', '../../.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // Authentication
    BetterAuthModule, // Better Auth endpoints at /api/v1/auth/*
    AuthModule, // Legacy JWT auth (kept for backward compatibility)

    // Feature modules
    TheoryModule,
    UsersModule,
    LibraryModule,
    ProgressModule,
    ColorModule,
    LessonsModule,
    AchievementsModule,
    ProfileModule,
  ],
  // Sans APP_GUARD, ThrottlerModule ne protège rien.
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
