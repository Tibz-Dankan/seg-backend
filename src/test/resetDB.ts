import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resetDB = async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.signupToken.deleteMany(),
    prisma.accessToken.deleteMany(),
  ]);
};
