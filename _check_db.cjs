const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
(async () => {
  const allStatuses = {};
  for (const status of ["ACTIVE", "PENDING_REVIEW", "DRAFT", "INACTIVE"]) {
    const count = await p.jobPost.count({ where: { status } });
    allStatuses[status] = count;
  }
  console.log("JobPost counts by status:", JSON.stringify(allStatuses));

  const total = await p.jobPost.count();
  console.log("Total job posts:", total);

  const recent = await p.jobPost.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, titleEn: true, status: true, category: true, createdAt: true },
  });
  console.log("Recent 5:", JSON.stringify(recent, null, 2));
  
  await p.$disconnect();
})();
