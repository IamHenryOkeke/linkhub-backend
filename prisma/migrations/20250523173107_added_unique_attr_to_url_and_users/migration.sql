/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_userId_url_key" ON "Link"("userId", "url");
