/*
  Warnings:

  - You are about to drop the column `activities` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `assessment` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `lesson` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `objectives` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `resources` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `subtopic` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `MasterSchemeEntry` table. All the data in the column will be lost.
  - Added the required column `referenceBook` to the `MasterScheme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assessmentMethods` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyInquiryQuestions` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningExperiences` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningResources` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonLearningOutcomes` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonNumber` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strand` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subStrand` to the `MasterSchemeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MasterScheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "curriculum" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "referenceBook" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MasterScheme" ("createdAt", "curriculum", "id", "level", "subject", "term", "weeks") SELECT "createdAt", "curriculum", "id", "level", "subject", "term", "weeks" FROM "MasterScheme";
DROP TABLE "MasterScheme";
ALTER TABLE "new_MasterScheme" RENAME TO "MasterScheme";
CREATE TABLE "new_MasterSchemeEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schemeId" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "strand" TEXT NOT NULL,
    "subStrand" TEXT NOT NULL,
    "lessonLearningOutcomes" TEXT NOT NULL,
    "learningExperiences" TEXT NOT NULL,
    "keyInquiryQuestions" TEXT NOT NULL,
    "learningResources" TEXT NOT NULL,
    "assessmentMethods" TEXT NOT NULL,
    "reflection" TEXT,
    CONSTRAINT "MasterSchemeEntry_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "MasterScheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MasterSchemeEntry" ("id", "schemeId", "week") SELECT "id", "schemeId", "week" FROM "MasterSchemeEntry";
DROP TABLE "MasterSchemeEntry";
ALTER TABLE "new_MasterSchemeEntry" RENAME TO "MasterSchemeEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
