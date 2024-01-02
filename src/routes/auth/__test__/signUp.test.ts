import { describe, expect, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[POST] /api/v1/users/signup", async () => {
  it("returns a 201 on successful signup", async () => {
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
    return request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(201);
  });

  it("returns a 400 with an invalid email", async () => {
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
    return request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "matt.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
  });

  it("returns a 400 with missing firstName or lastName or email or gender or password or signupToken ", async () => {
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
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "",
        signupToken: 12345678,
      })
      .expect(400);
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: "",
      })
      .expect(400);
  });

  it("returns for invalid gender", async () => {
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
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "someGender",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
  });

  it("disallows duplicate emails", async () => {
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
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "johndoe@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(400);
  });

  it("return 403 for invalid signupToken", async () => {
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
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        phoneNumber: "0787489045",
        gender: "male",
        password: "password",
        signupToken: 20345678,
      })
      .expect(403);
  });

  it("return 403 for already used signupToken", async () => {
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

    const newSignupToken = await prisma.signupToken.create({
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
      where: { tokenId: newSignupToken.tokenId },
      data: {
        used: true,
        usedAt: currentDateISOString,
        expiresAt: currentDateISOString,
      },
    });
    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(403);
  });

  it("return 403 for expired signupToken", async () => {
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
        expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    });

    await request(app)
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(403);
  });

  it("expects a token after signup", async () => {
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
      .post("/api/v1/users/signup")
      .send({
        firstName: "Matt",
        lastName: "Lee",
        email: "mattlee@gmail.com",
        gender: "male",
        phoneNumber: "0787489045",
        password: "password",
        signupToken: 12345678,
      })
      .expect(201);

    expect(res.body).toHaveProperty("accessToken");
  });
});
