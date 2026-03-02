import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TheoryModule } from './theory/theory.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per minute
    }]),

    // Feature modules
    AuthModule,
    TheoryModule,
    UsersModule,
    LibraryModule,
    ProgressModule,
  ],
})
export class AppModule {}
