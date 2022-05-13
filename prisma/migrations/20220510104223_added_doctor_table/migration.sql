-- CreateTable
CREATE TABLE "Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");
