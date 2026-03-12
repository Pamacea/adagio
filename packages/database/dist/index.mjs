// src/index.ts
import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
var index_default = prisma;
async function userExists(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  return !!user;
}
async function getUserWithPreferences(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true
    }
  });
}
async function getOrCreatePreferences(userId) {
  let prefs = await prisma.userPreferences.findUnique({
    where: { userId }
  });
  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: { userId }
    });
  }
  return prefs;
}
export {
  index_default as default,
  getOrCreatePreferences,
  getUserWithPreferences,
  prisma,
  userExists
};
//# sourceMappingURL=index.mjs.map