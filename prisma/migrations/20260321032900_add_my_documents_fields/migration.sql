/*
  Warnings:

  - You are about to drop the `MasterSchemeEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MasterSchemeEntry";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratedDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "lessonsPerWeek" INTEGER NOT NULL,
    "classLevel" TEXT,
    "referenceBook" TEXT,
    "breaksJson" TEXT DEFAULT '[]',
    "schemeHeadersJson" TEXT DEFAULT '[]',
    "schemeRowsJson" TEXT DEFAULT '[]',
    "midtermBreak" TEXT,
    "examBreak" TEXT,
    "firstTeachingDay" TEXT NOT NULL,
    "lastTeachingDay" TEXT NOT NULL,
    "schemeText" TEXT,
    "lessonPlanText" TEXT,
    "recordOfWorkText" TEXT,
    "title" TEXT,
    "documentType" TEXT,
    "year" INTEGER,
    "pdfFileName" TEXT,
    "pdfFileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedDocument_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GeneratedDocument" ("createdAt", "examBreak", "firstTeachingDay", "id", "lastTeachingDay", "lessonPlanText", "lessonsPerWeek", "midtermBreak", "recordOfWorkText", "schemeText", "subject", "teacherId", "term", "weeks") SELECT "createdAt", "examBreak", "firstTeachingDay", "id", "lastTeachingDay", "lessonPlanText", "lessonsPerWeek", "midtermBreak", "recordOfWorkText", "schemeText", "subject", "teacherId", "term", "weeks" FROM "GeneratedDocument";
DROP TABLE "GeneratedDocument";
ALTER TABLE "new_GeneratedDocument" RENAME TO "GeneratedDocument";
CREATE INDEX "GeneratedDocument_teacherId_idx" ON "GeneratedDocument"("teacherId");
CREATE INDEX "GeneratedDocument_teacherId_year_idx" ON "GeneratedDocument"("teacherId", "year");
CREATE INDEX "GeneratedDocument_teacherId_term_idx" ON "GeneratedDocument"("teacherId", "term");
CREATE INDEX "GeneratedDocument_teacherId_documentType_idx" ON "GeneratedDocument"("teacherId", "documentType");
CREATE INDEX "GeneratedDocument_teacherId_year_term_documentType_idx" ON "GeneratedDocument"("teacherId", "year", "term", "documentType");
CREATE TABLE "new_MasterScheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "headersJson" TEXT NOT NULL DEFAULT '[]',
    "rowsJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MasterScheme" ("createdAt", "id", "level", "subject", "term") SELECT "createdAt", "id", "level", "subject", "term" FROM "MasterScheme";
DROP TABLE "MasterScheme";
ALTER TABLE "new_MasterScheme" RENAME TO "MasterScheme";
CREATE UNIQUE INDEX "MasterScheme_term_level_subject_key" ON "MasterScheme"("term", "level", "subject");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
