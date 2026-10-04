"use strict";
// ============================================================================
// PRISMA CLIENT - Singleton instance
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.userExists = userExists;
exports.getUserWithPreferences = getUserWithPreferences;
exports.getOrCreatePreferences = getOrCreatePreferences;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
// ============================================================================
// TYPES - Export Prisma types
// ============================================================================
__exportStar(require("@prisma/client"), exports);
// ============================================================================
// HELPERS - Common database operations
// ============================================================================
/**
 * Check if a user exists by ID
 */
async function userExists(userId) {
    const user = await exports.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    return !!user;
}
/**
 * Get user with preferences
 */
async function getUserWithPreferences(userId) {
    return exports.prisma.user.findUnique({
        where: { id: userId },
        include: {
            preferences: true,
        },
    });
}
/**
 * Create or get user preferences
 */
async function getOrCreatePreferences(userId) {
    let prefs = await exports.prisma.userPreferences.findUnique({
        where: { userId },
    });
    if (!prefs) {
        prefs = await exports.prisma.userPreferences.create({
            data: { userId },
        });
    }
    return prefs;
}
