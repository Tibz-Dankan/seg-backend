import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resetDB = async () => {
  await prisma.$transaction([
    prisma.signupToken.deleteMany(),
    prisma.accessToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
