import { describe, expect, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { randomBytes, createHash } from "crypto";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[PATCH] /api/v1/users/get-user", async () => {
  it("returns a 200 on successfully finding user", async () => {
    const newUser = await prisma.user.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
        role: "admin",
        password: await hash("password", 10),
      },
      select: { userId: true },
    });

    return request(app)
      .get(`/api/v1/users/get-user/${newUser.userId}`)
      .send({
        currentPassword: "password",
        newPassword: "newPassword",
      })
      .expect(200);
  });

  it("returns a 404 if no there is no user with provided userId", async () => {
    return await request(app)
      .get(`/api/v1/users/get-user/${"someUserId"}`)
      .send({
        currentPassword: "thePassword",
        newPassword: "newPassword",
      })
      .expect(404);
  });
});
