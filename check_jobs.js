const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const jobs = await prisma.jobPost.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, titleEn: true, titleAs: true } });
  for (const j of jobs) {
    console.log('ID:', j.id);
    console.log('titleEn:', j.titleEn);
    console.log('titleAs:', j.titleAs);
    console.log('titleAs chars:', [...j.titleAs].map(c => 'U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' '));
    console.log('---');
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
