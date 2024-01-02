import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { randomBytes, createHash } from "crypto";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[PATCH] /api/v1/users/reset-password", async () => {
  it("returns a 200 on successful password reset", async () => {
    const newUser = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { userId: newUser.userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: new Date(
          Date.now() + 1000 * 60 * 20
        ).toISOString(),
      },
    });

    return request(app)
      .patch(`/api/v1/users/reset-password/${resetToken}`)
      .send({
        password: "newPassword",
      })
      .expect(200);
  });

  it("returns a 400 with missing token", async () => {
    await request(app)
      .patch(`/api/v1/users/reset-password/${null}`)
      .send({
        password: "newPassword",
      })
      .expect(400);
  });

  it("returns a 400 with missing password", async () => {
    const newUser = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { userId: newUser.userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: new Date(
          Date.now() + 1000 * 60 * 20
        ).toISOString(),
      },
    });
    await request(app)
      .patch(`/api/v1/users/reset-password/${resetToken}`)
      .send({
        password: "",
      })
      .expect(400);
  });

  it("returns a 400 if token is invalid", async () => {
    const newUser = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { userId: newUser.userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: new Date(
          Date.now() + 1000 * 60 * 20
        ).toISOString(),
      },
    });
    await request(app)
      .patch(`/api/v1/users/reset-password/${"invalid-token"}`)
      .send({
        email: "jo@gmail.com",
      })
      .expect(400);
  });

  it("returns a 400 if token is expired", async () => {
    const newUser = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { userId: newUser.userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: new Date(
          Date.now() - 1000 * 60 * 20
        ).toISOString(),
      },
    });
    await request(app)
      .patch(`/api/v1/users/reset-password/${resetToken}`)
      .send({
        password: "newPassword",
      })
      .expect(400);
  });
});
