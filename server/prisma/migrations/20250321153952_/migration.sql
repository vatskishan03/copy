-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Snippet_token_key" ON "Snippet"("token");

-- CreateIndex
CREATE INDEX "Snippet_token_idx" ON "Snippet"("token");

-- CreateIndex
CREATE INDEX "Snippet_expiresAt_idx" ON "Snippet"("expiresAt");

-- CreateIndex
CREATE INDEX "Snippet_lastAccessed_idx" ON "Snippet"("lastAccessed");
