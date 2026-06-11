require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.notification.findMany();

    console.log("SUCCESS");
    console.log(result);
  } catch (error) {
    console.error("ERROR");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();