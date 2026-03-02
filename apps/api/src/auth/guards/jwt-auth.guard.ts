import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // In production, validate JWT here
    // For now, we'll use a simple check
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      // Decode JWT and validate
      // For now, return true for demo
      request.user = { userId: 'demo-user-id' };
      return true;
    } catch {
      return false;
    }
  }
}
