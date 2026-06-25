/*
  Warnings:

  - Added the required column `referenceBook` to the `MasterScheme` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MasterScheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "referenceBook" TEXT NOT NULL,
    "headersJson" TEXT NOT NULL DEFAULT '[]',
    "rowsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MasterScheme" ("createdAt", "headersJson", "id", "level", "rowsJson", "subject", "term", "updatedAt") SELECT "createdAt", "headersJson", "id", "level", "rowsJson", "subject", "term", "updatedAt" FROM "MasterScheme";
DROP TABLE "MasterScheme";
ALTER TABLE "new_MasterScheme" RENAME TO "MasterScheme";
CREATE UNIQUE INDEX "MasterScheme_term_level_subject_referenceBook_key" ON "MasterScheme"("term", "level", "subject", "referenceBook");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
