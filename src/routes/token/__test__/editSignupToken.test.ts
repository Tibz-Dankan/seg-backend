import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[PATCH] /api/v1/tokens/edit-signup-token/:tokenId", async () => {
  it("returns a 401 when user tries to edit token she/he didn't generate", async () => {
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
    await prisma.user.create({
      data: {
        firstName: "Sarah",
        lastName: "Mary",
        gender: "female",
        email: "sarahmary@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });

    const token = await prisma.signupToken.create({
      data: {
        token: 12345678,
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
        generatedByUserId: newUser.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
      select: { tokenId: true },
    });

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "sarahmary@gmail.com",
        password: "password",
      })
      .expect(200);

    return request(app)
      .patch(`/api/v1/tokens/edit-signup-token/${token.tokenId}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(401);
  });

  it("returns a 404 if no token is found", async () => {
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

    await prisma.signupToken.create({
      data: {
        token: 12345678,
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
        generatedByUserId: newUser.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
    });

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);

    return request(app)
      .patch(`/api/v1/tokens/edit-signup-token/${"tokenIdDoesNotExist"}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(404);
  });

  it("returns a 400 if token is already used", async () => {
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

    const token = await prisma.signupToken.create({
      data: {
        token: 12345678,
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
        generatedByUserId: newUser.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
      select: { tokenId: true },
    });

    const currentDateISOString = new Date(Date.now()).toISOString();
    await prisma.signupToken.update({
      where: { tokenId: token.tokenId },
      data: {
        used: true,
        usedAt: currentDateISOString,
        expiresAt: currentDateISOString,
      },
    });

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);

    return request(app)
      .patch(`/api/v1/tokens/edit-signup-token/${token.tokenId}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns a 200 on successful editing", async () => {
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

    const token = await prisma.signupToken.create({
      data: {
        token: 12345678,
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
        generatedByUserId: newUser.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
      select: { tokenId: true },
    });

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);

    return request(app)
      .patch(`/api/v1/tokens/edit-signup-token/${token.tokenId}`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
  });
});
