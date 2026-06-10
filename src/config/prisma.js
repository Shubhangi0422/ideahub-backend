require("dotenv").config();
console.log("Prisma URL =>", process.env.DATABASE_URL);
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;