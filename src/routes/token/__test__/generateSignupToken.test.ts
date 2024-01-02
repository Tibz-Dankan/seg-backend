import { describe, expect, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

// pnpm test -- generateSignupToken.test.ts  //To find out how to run single test file using vitest

describe("[POST] /api/v1/generate-signup-token", async () => {
  it("returns a 400 for missing associatedRole or associatedEmail", async () => {
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

    await request(app)
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "",
        associatedRole: "admin",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns a 400 for invalid associatedRole or associatedEmail ", async () => {
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

    await request(app)
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "theInvalidRole",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);

    await request(app)
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "matt.com",
        associatedRole: "admin",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns a 201 on successful generation of signupToken", async () => {
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
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(201);
  });

  it("expects a signupToken for successful request", async () => {
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

    const generateSignupTokenResponse = await request(app)
      .post(`/api/v1/tokens/generate-signup-token`)
      .send({
        associatedEmail: "mattlee@gmail.com",
        associatedRole: "admin",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(201);

    expect(generateSignupTokenResponse.body.data).toHaveProperty("token");
  });
});
