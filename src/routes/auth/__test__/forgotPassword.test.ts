import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[POST] /api/v1/users/forgot-password", async () => {
  it("returns a 200 on successful forgotPassword initialization", async () => {
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

    return request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: "johndoe@gmail.com",
      })
      .expect(200);
  });

  it("returns a 400 with missing email", async () => {
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
    await request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: "",
      })
      .expect(400);
  });

  it("returns a 404 if user of email does not exist  ", async () => {
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
    await request(app)
      .post("/api/v1/users/forgot-password")
      .send({
        email: "jo@gmail.com",
      })
      .expect(404);
  });
});
