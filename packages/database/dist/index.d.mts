import * as _prisma_client_runtime_library from '@prisma/client/runtime/library';
import * as _prisma_client from '@prisma/client';
import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

declare const prisma: PrismaClient<_prisma_client.Prisma.PrismaClientOptions, never, _prisma_client_runtime_library.DefaultArgs>;

/**
 * Check if a user exists by ID
 */
declare function userExists(userId: string): Promise<boolean>;
/**
 * Get user with preferences
 */
declare function getUserWithPreferences(userId: string): Promise<({
    preferences: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        theme: string;
        showIntervals: boolean;
        showNotes: boolean;
        showDegrees: boolean;
        tuning: string;
        fretCount: number;
        volume: number;
        metronomeVolume: number;
        totalXP: number;
        level: number;
    } | null;
} & {
    id: string;
    email: string;
    emailVerified: boolean;
    password: string | null;
    name: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}) | null>;
/**
 * Create or get user preferences
 */
declare function getOrCreatePreferences(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    theme: string;
    showIntervals: boolean;
    showNotes: boolean;
    showDegrees: boolean;
    tuning: string;
    fretCount: number;
    volume: number;
    metronomeVolume: number;
    totalXP: number;
    level: number;
}>;

export { prisma as default, getOrCreatePreferences, getUserWithPreferences, prisma, userExists };
