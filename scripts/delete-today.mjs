import { PrismaClient } from "../src/generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const conn = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: conn });
const prisma = new PrismaClient({ adapter });

try {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const r = await prisma.currentAffair.deleteMany({ where: { digestDate: today } });
  console.log("Deleted", r.count, "articles");
} finally {
  await prisma.$disconnect();
}
