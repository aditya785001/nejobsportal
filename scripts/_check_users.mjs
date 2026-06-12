import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  const users = await p.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  console.log(JSON.stringify(users, null, 2));
} finally {
  await p.$disconnect();
}
