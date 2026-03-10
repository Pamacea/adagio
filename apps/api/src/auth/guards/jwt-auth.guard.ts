import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    try {
      const token = authHeader.replace('Bearer ', '');

      // Verify JWT signature and expiration
      const payload = this.jwtService.verify(token);

      // Validate required payload fields
      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Attach validated user to request
      request.user = {
        userId: payload.sub,
        email: payload.email,
      };

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
