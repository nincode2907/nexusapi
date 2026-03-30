import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding TopupPackages...");

  const packages = [
    {
      name: "Startup",
      priceVnd: 50000,
      creditAmnt: 50000,
      bonusCredit: 0,
      isActive: true,
    },
    {
      name: "Pro",
      priceVnd: 200000,
      creditAmnt: 200000,
      bonusCredit: 20000,
      isActive: true,
    },
    {
      name: "Shark",
      priceVnd: 500000,
      creditAmnt: 500000,
      bonusCredit: 100000,
      isActive: true,
    },
  ];

  await prisma.topupPackage.deleteMany({}); // Clear existing to prevent duplicates during testing

  for (const pkg of packages) {
    await prisma.topupPackage.create({
      data: pkg,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
