// ============================================================================
// AUTH SERVICE TESTS
// ============================================================================
//
// Tests unitaires pour AuthService
// Couvre: register, login, refreshTokens, validateUser
// ============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { prisma } from '@adagio/database';

// Mock Prisma
jest.mock('@adagio/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  // Mock data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$10$hashedpassword',
    image: null,
    emailVerified: false,
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    expiresIn: 3600,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verify: jest.fn().mockReturnValue({ sub: 'user-123', email: 'test@example.com' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        name: 'New User',
      };

      // Mock user not found
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock password hash
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');

      // Mock user creation
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-id',
        email: registerDto.email,
        name: registerDto.name,
        password: '$2b$10$hashedpassword',
      });

      // Mock token generation
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user).toEqual({
        id: 'new-user-id',
        email: registerDto.email,
        name: registerDto.name,
      });
      expect(result.tokens).toEqual(mockTokens);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          password: '$2b$10$hashedpassword',
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        name: 'Existing User',
      };

      // Mock user found
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('User already exists')
      );

      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should hash password with SALT_ROUNDS', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        name: 'New User',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should register without optional name field', async () => {
      const registerDto = {
        email: 'noname@example.com',
        password: 'SecurePass123!',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-id',
        email: registerDto.email,
        name: '',
        password: '$2b$10$hashedpassword',
      });
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.register(registerDto);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(registerDto.email);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'CorrectPassword123!',
      };

      // Mock user found
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Mock password verification
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mock token generation
      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        image: mockUser.image,
        emailVerified: mockUser.emailVerified,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'SomePassword123!',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
    });

    it('should throw UnauthorizedException if user has no password', async () => {
      const loginDto = {
        email: 'oauth@example.com',
        password: 'SomePassword123!',
      };

      const oauthUser = { ...mockUser, password: null };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(oauthUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Account uses OAuth or has no password set')
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should handle bcrypt compare errors gracefully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'SomePassword123!',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('bcrypt error'));

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';

      (jwtService.verify as jest.Mock).mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      (jwtService.signAsync as jest.Mock)
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshTokens(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresIn');
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      const invalidToken = 'invalid-token';

      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshTokens(invalidToken)).rejects.toThrow(
        new UnauthorizedException('Invalid token')
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const refreshToken = 'valid-token-but-no-user';

      (jwtService.verify as jest.Mock).mockReturnValue({
        sub: 'nonexistent-user',
        email: 'nonexistent@example.com',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid token')
      );
    });

    it('should handle jwt verify errors', async () => {
      const expiredToken = 'expired-token';

      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.refreshTokens(expiredToken)).rejects.toThrow(
        new UnauthorizedException('Invalid token')
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data without password', async () => {
      // Mock Prisma to simulate select behavior
      const selectedUser = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        image: mockUser.image,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(selectedUser);

      const result = await service.validateUser(mockUser.id);

      expect(result).toEqual(selectedUser);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      });
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser('nonexistent-id');

      expect(result).toBeNull();
    });

    it('should not include password in returned user data', async () => {
      const selectedUser = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        image: mockUser.image,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(selectedUser);

      const result = await service.validateUser(mockUser.id);

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('token generation', () => {
    it('should generate tokens with correct expiration times', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        name: 'New User',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'new-user-id',
        email: registerDto.email,
        name: registerDto.name,
      });

      let accessTokenPayload, refreshTokenPayload;

      (jwtService.signAsync as jest.Mock).mockImplementation(async (payload, options) => {
        if (options.expiresIn === '1h') {
          accessTokenPayload = payload;
          return 'access-token';
        }
        if (options.expiresIn === '7d') {
          refreshTokenPayload = payload;
          return 'refresh-token';
        }
        return 'token';
      });

      await service.register(registerDto);

      expect(accessTokenPayload).toEqual({
        sub: 'new-user-id',
        email: registerDto.email,
      });

      expect(refreshTokenPayload).toEqual({
        sub: 'new-user-id',
        email: registerDto.email,
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });
});
