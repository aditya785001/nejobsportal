import { PrismaClient } from "../src/generated/prisma/client";
const prisma = new PrismaClient();
async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await prisma.currentAffair.deleteMany({ where: { digestDate: today } });
  console.log("Deleted", result.count, "articles");
}
main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
