import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
export * from '@prisma/client';
/**
 * Check if a user exists by ID
 */
export declare function userExists(userId: string): Promise<boolean>;
/**
 * Get user with preferences
 */
export declare function getUserWithPreferences(userId: string): Promise<({
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
export declare function getOrCreatePreferences(userId: string): Promise<{
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
//# sourceMappingURL=index.d.ts.map