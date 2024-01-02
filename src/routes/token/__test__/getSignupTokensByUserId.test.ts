import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[GET] /api/v1/generate-signup-token", async () => {
  it("returns a 400 for  a missing generatedByUserId", async () => {
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
      .get(`/api/v1/tokens/get-signup-tokens`)
      .query({ generatedByUserId: "" })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns a 404 if user has no signupTokens", async () => {
    await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "superadmin",
        password: await hash("password", 10),
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
      .get(`/api/v1/tokens/get-all-tokens`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(404);
  });

  it("returns a 200 on successfully fetching signupTokens", async () => {
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
      .get(`/api/v1/tokens/get-all-tokens`)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
  });
});
