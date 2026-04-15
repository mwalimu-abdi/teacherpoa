-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GeneratedDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "lessonsPerWeek" INTEGER NOT NULL,
    "midtermBreak" TEXT,
    "examBreak" TEXT,
    "firstTeachingDay" TEXT NOT NULL,
    "lastTeachingDay" TEXT NOT NULL,
    "schemeText" TEXT,
    "lessonPlanText" TEXT,
    "recordOfWorkText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GeneratedDocument_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MasterScheme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "curriculum" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "weeks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MasterSchemeEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schemeId" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "lesson" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "subtopic" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    CONSTRAINT "MasterSchemeEntry_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "MasterScheme" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
