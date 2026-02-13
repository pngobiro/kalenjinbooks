-- CreateTable
CREATE TABLE "HardCopyRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "authorResponse" TEXT,
    "estimatedPrice" REAL,
    "estimatedDelivery" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "respondedAt" DATETIME,
    CONSTRAINT "HardCopyRequest_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HardCopyRequest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "HardCopyRequest_authorId_idx" ON "HardCopyRequest"("authorId");

-- CreateIndex
CREATE INDEX "HardCopyRequest_bookId_idx" ON "HardCopyRequest"("bookId");

-- CreateIndex
CREATE INDEX "HardCopyRequest_status_idx" ON "HardCopyRequest"("status");

-- CreateIndex
CREATE INDEX "HardCopyRequest_createdAt_idx" ON "HardCopyRequest"("createdAt");
