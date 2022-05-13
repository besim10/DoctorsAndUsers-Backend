/*
  Warnings:

  - Added the required column `doctorId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("end", "id", "start", "title", "userId") SELECT "end", "id", "start", "title", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
