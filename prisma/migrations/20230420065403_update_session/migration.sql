/*
  Warnings:

  - A unique constraint covering the columns `[user_id,ip_address]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sessions_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "sessions_user_id_ip_address_key" ON "sessions"("user_id", "ip_address");
