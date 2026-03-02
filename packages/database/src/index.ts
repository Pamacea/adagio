// ============================================================================
// PRISMA CLIENT - Singleton instance
// ============================================================================

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// ============================================================================
// TYPES - Export Prisma types
// ============================================================================

export * from '@prisma/client';

// ============================================================================
// HELPERS - Common database operations
// ============================================================================

/**
 * Check if a user exists by ID
 */
export async function userExists(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return !!user;
}

/**
 * Get user with preferences
 */
export async function getUserWithPreferences(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
    },
  });
}

/**
 * Create or get user preferences
 */
export async function getOrCreatePreferences(userId: string) {
  let prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: { userId },
    });
  }

  return prefs;
}
