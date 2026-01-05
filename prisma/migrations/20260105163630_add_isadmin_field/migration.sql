-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "phoneNumber" TEXT,
    "paymentMethod" TEXT,
    "paymentDetails" TEXT,
    "totalEarnings" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dateOfBirth" TEXT,
    "nationality" TEXT,
    "location" TEXT,
    "education" TEXT,
    "occupation" TEXT,
    "writingExperience" TEXT,
    "previousPublications" TEXT,
    "awards" TEXT,
    "genres" TEXT,
    "languages" TEXT,
    "writingStyle" TEXT,
    "inspirations" TEXT,
    "targetAudience" TEXT,
    "publishingGoals" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "howDidYouHear" TEXT,
    "additionalInfo" TEXT,
    "agreeToMarketing" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Author_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Author" ("bio", "createdAt", "id", "paymentDetails", "paymentMethod", "phoneNumber", "profileImage", "totalEarnings", "updatedAt", "userId") SELECT "bio", "createdAt", "id", "paymentDetails", "paymentMethod", "phoneNumber", "profileImage", "totalEarnings", "updatedAt", "userId" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_userId_key" ON "Author"("userId");
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "fileKey" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "rentalPrice" REAL,
    "previewPages" INTEGER NOT NULL DEFAULT 10,
    "category" TEXT,
    "language" TEXT NOT NULL DEFAULT 'Kalenjin',
    "isbn" TEXT,
    "tags" TEXT,
    "publishedAt" DATETIME,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "featuredOrder" INTEGER,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "category", "coverImage", "createdAt", "description", "fileKey", "fileSize", "fileType", "id", "isPublished", "language", "previewPages", "price", "publishedAt", "title", "updatedAt") SELECT "authorId", "category", "coverImage", "createdAt", "description", "fileKey", "fileSize", "fileType", "id", "isPublished", "language", "previewPages", "price", "publishedAt", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "googleId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'READER',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "googleId", "id", "image", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "googleId", "id", "image", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
