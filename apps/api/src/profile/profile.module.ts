import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
