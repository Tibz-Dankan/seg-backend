import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";
import { resolve } from "path";

describe("[PATCH] /api/v1/upload-user-image/:userId", async () => {
  it("returns a 200 on successfully uploading image", async () => {
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
    const imagePath = resolve("./src/test/assets/test-image.png");

    return request(app)
      .patch(`/api/v1/users/upload-user-image/${newUser.userId}`)
      .attach("file", imagePath)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
  });

  it("returns 400 if uploaded file is not an image", async () => {
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
    const imagePath = resolve("./src/test/assets/test-ppt.pptx");

    return request(app)
      .patch(`/api/v1/users/upload-user-image/${newUser.userId}`)
      .attach("file", imagePath)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns 404 if there is no user of the provided userId", async () => {
    await prisma.user.create({
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
    const imagePath = resolve("./src/test/assets/test-image.png");

    return request(app)
      .patch(`/api/v1/users/upload-user-image/${"someUserId"}`)
      .attach("file", imagePath)
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(404);
  });
});
