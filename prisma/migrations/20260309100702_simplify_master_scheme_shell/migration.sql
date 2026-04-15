/*
  Warnings:

  - You are about to drop the column `curriculum` on the `MasterScheme` table. All the data in the column will be lost.
  - You are about to drop the column `referenceBook` on the `MasterScheme` table. All the data in the column will be lost.
  - You are about to drop the column `weeks` on the `MasterScheme` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MasterScheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MasterScheme" ("createdAt", "id", "level", "subject", "term") SELECT "createdAt", "id", "level", "subject", "term" FROM "MasterScheme";
DROP TABLE "MasterScheme";
ALTER TABLE "new_MasterScheme" RENAME TO "MasterScheme";
CREATE UNIQUE INDEX "MasterScheme_term_level_subject_key" ON "MasterScheme"("term", "level", "subject");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
