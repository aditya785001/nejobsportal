/**
 * Admin Seeder
 * Creates an admin user or promotes an existing user to ADMIN role.
 * 
 * Usage: npx tsx scripts/seed-admin.ts
 * 
 * Environment variables:
 *   ADMIN_EMAIL (default: admin@nejobsportal.dev)
 *   ADMIN_NAME  (default: Admin)
 */

import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@nejobsportal.dev";
  const name = process.env.ADMIN_NAME || "Admin";

  console.log(`📧 Ensuring admin user: ${email}`);

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    if (user.role !== "ADMIN") {
      user = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN", name: user.name || name },
      });
      console.log(`✅ Promoted ${email} to ADMIN`);
    } else {
      console.log(`✅ ${email} is already an ADMIN`);
    }
  } else {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Created admin user: ${email}`);
  }

  console.log(`\nAdmin user details:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Name:  ${user.name}`);
  console.log(`  Role:  ${user.role}`);
  console.log(`\nSet DEV_ADMIN_PASSWORD in .env to enable login via /admin/login`);
}

main().catch((e) => {
  console.error("❌ Failed to seed admin:", e);
  process.exit(1);
});
