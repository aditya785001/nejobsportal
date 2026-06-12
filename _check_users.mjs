import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
try {
  const users = await p.user.findMany({ take: 5 });
  console.log(JSON.stringify(users, null, 2));
} catch (e) {
  console.error(e.message);
} finally {
  await p.$disconnect();
}
