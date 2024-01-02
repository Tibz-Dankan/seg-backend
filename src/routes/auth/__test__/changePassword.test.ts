import { describe, expect, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { randomBytes, createHash } from "crypto";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[PATCH] /api/v1/users/change-password", async () => {
  it("returns a 200 on successful password change", async () => {
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

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);

    return request(app)
      .patch(`/api/v1/users/change-password/${newUser.userId}`)
      .send({
        currentPassword: "password",
        newPassword: "newPassword",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
  });

  //   it("returns a 400 if no userId is provided", async () => {
  //     await prisma.user.create({
  //       data: {
  //         firstName: "John",
  //         lastName: "Doe",
  //         gender: "male",
  //         email: "johndoe@gmail.com",
  //         phoneNumber: "0787489045",
  //         role: "admin",
  //         password: await hash("password", 10),
  //       },
  //     });

  //     const res: Response = await request(app)
  //       .post("/api/v1/users/signin")
  //       .send({
  //         email: "johndoe@gmail.com",
  //         password: "password",
  //       })
  //       .expect(200);
  //     return await request(app)
  //       .patch(`/api/v1/users/change-password/${0}`)
  //       .send({
  //         currentPassword: "password",
  //         newPassword: "newPassword",
  //       })
  //       .set("Authorization", `Bearer ${res.body.accessToken}`)
  //       .expect(400);
  //   });

  it("returns a 403 if currentPassword is wrong", async () => {
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

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);
    return await request(app)
      .patch(`/api/v1/users/change-password/${newUser.userId}`)
      .send({
        currentPassword: "thePassword",
        newPassword: "newPassword",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(403);
  });

  it("returns a 403 if newPassword same as currentPassword", async () => {
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

    const res: Response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "password",
      })
      .expect(200);
    return await request(app)
      .patch(`/api/v1/users/change-password/${newUser.userId}`)
      .send({
        currentPassword: "password",
        newPassword: "password",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(403);
  });
});
