/*
  Warnings:

  - You are about to drop the column `pdfFileName` on the `GeneratedDocument` table. All the data in the column will be lost.
  - You are about to drop the column `pdfFileUrl` on the `GeneratedDocument` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `GeneratedDocument` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GeneratedDocument` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SchoolClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SchoolClass_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassTeacherRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "roleType" TEXT NOT NULL,
    "subject" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClassTeacherRole_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassTeacherRole_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT,
    "parentName" TEXT,
    "parentPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AttendanceRecord_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recordId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AttendanceEntry_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "AttendanceRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AttendanceEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceSummary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classId" INTEGER NOT NULL,
    "periodType" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "reportDate" DATETIME,
    "year" INTEGER NOT NULL,
    "term" TEXT,
    "weekLabel" TEXT,
    "totalStudents" INTEGER NOT NULL,
    "totalPresent" INTEGER NOT NULL,
    "totalAbsent" INTEGER NOT NULL,
    "attendancePercentage" REAL NOT NULL,
    "mostAbsentStudentId" INTEGER,
    "mostAbsentStudentName" TEXT,
    "mostAbsentCount" INTEGER NOT NULL DEFAULT 0,
    "mostPresentStudentId" INTEGER,
    "mostPresentStudentName" TEXT,
    "mostPresentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AttendanceSummary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordResetOtp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherId" INTEGER NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetOtp_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratedDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2026,
    "term" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'Scheme of Work',
    "subject" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "lessonsPerWeek" INTEGER NOT NULL,
    "classLevel" TEXT,
    "referenceBook" TEXT,
    "breaksJson" TEXT DEFAULT '[]',
    "schemeHeadersJson" TEXT DEFAULT '[]',
    "schemeRowsJson" TEXT DEFAULT '[]',
    "midtermBreak" TEXT,
    "examBreak" TEXT,
    "firstTeachingDay" TEXT,
    "lastTeachingDay" TEXT,
    "schemeText" TEXT,
    "lessonPlanText" TEXT,
    "recordOfWorkText" TEXT,
    "learnersProgressText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedDocument_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GeneratedDocument" ("breaksJson", "classLevel", "createdAt", "documentType", "examBreak", "firstTeachingDay", "id", "lastTeachingDay", "lessonPlanText", "lessonsPerWeek", "midtermBreak", "recordOfWorkText", "referenceBook", "schemeHeadersJson", "schemeRowsJson", "schemeText", "subject", "teacherId", "term", "weeks", "year") SELECT "breaksJson", "classLevel", "createdAt", coalesce("documentType", 'Scheme of Work') AS "documentType", "examBreak", "firstTeachingDay", "id", "lastTeachingDay", "lessonPlanText", "lessonsPerWeek", "midtermBreak", "recordOfWorkText", "referenceBook", "schemeHeadersJson", "schemeRowsJson", "schemeText", "subject", "teacherId", "term", "weeks", coalesce("year", 2026) AS "year" FROM "GeneratedDocument";
DROP TABLE "GeneratedDocument";
ALTER TABLE "new_GeneratedDocument" RENAME TO "GeneratedDocument";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SchoolClass_level_stream_key" ON "SchoolClass"("level", "stream");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTeacherRole_classId_teacherId_roleType_subject_key" ON "ClassTeacherRole"("classId", "teacherId", "roleType", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "Student_classId_admissionNumber_key" ON "Student"("classId", "admissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_classId_date_key" ON "AttendanceRecord"("classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceEntry_recordId_studentId_key" ON "AttendanceEntry"("recordId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSummary_classId_periodType_periodKey_key" ON "AttendanceSummary"("classId", "periodType", "periodKey");
