-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "isFreeReading" BOOLEAN NOT NULL DEFAULT false,
    "featuredOrder" INTEGER,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "category", "coverImage", "createdAt", "description", "featuredOrder", "fileKey", "fileSize", "fileType", "id", "isActive", "isFeatured", "isPublished", "isbn", "language", "previewPages", "price", "publishedAt", "rating", "rentalPrice", "reviewCount", "tags", "title", "updatedAt") SELECT "authorId", "category", "coverImage", "createdAt", "description", "featuredOrder", "fileKey", "fileSize", "fileType", "id", "isActive", "isFeatured", "isPublished", "isbn", "language", "previewPages", "price", "publishedAt", "rating", "rentalPrice", "reviewCount", "tags", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
