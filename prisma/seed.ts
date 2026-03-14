import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin", 12);

  await prisma.user.upsert({
    where: {
      login: "admin",
    },
    update: {
      passwordHash,
      name: "admin",
    },
    create: {
      login: "admin",
      passwordHash,
      name: "admin",
      profile: {
        create: {},
      },
    },
  });

  console.log("Seed completed. Dev/test account 'admin' is ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
