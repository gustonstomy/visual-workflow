/*
  Warnings:

  - Added the required column `userId` to the `workflows` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create a default user for existing workflows
INSERT INTO "users" ("id", "email", "password", "name", "createdAt", "updatedAt")
VALUES (
  'default-user-id',
  'admin@visual-workflow.com',
  '$2a$10$dummy.hash.for.default.user.placeholder',
  'Admin User',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workflows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workflows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
-- Assign existing workflows to the default user
INSERT INTO "new_workflows" ("createdAt", "description", "id", "isActive", "name", "updatedAt", "userId") 
SELECT "createdAt", "description", "id", "isActive", "name", "updatedAt", 'default-user-id' FROM "workflows";
DROP TABLE "workflows";
ALTER TABLE "new_workflows" RENAME TO "workflows";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
