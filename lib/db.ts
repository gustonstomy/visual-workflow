import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a singleton instance using dynamic initialization
export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const adapter = new PrismaLibSql({
      url: `file:${process.cwd()}/prisma/dev.db`,
    });

    const client = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    return client;
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
