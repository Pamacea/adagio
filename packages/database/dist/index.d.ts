export declare const prisma: any;
export default prisma;
export * from '@prisma/client';
/**
 * Check if a user exists by ID
 */
export declare function userExists(userId: string): Promise<boolean>;
/**
 * Get user with preferences
 */
export declare function getUserWithPreferences(userId: string): Promise<any>;
/**
 * Create or get user preferences
 */
export declare function getOrCreatePreferences(userId: string): Promise<any>;
//# sourceMappingURL=index.d.ts.map