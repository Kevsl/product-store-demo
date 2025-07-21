-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdBy" VARCHAR(36);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
