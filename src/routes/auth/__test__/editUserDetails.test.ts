import { describe, it } from "vitest";
import { server as app } from "../../../app";
import request from "supertest";
import { Response } from "supertest";
import { prisma } from "../../../test/prisma";
import { hash } from "bcryptjs";

describe("[PATCH] /api/v1/edit-users/user-details/:userId", async () => {
  it("returns a 200 on successfully updating user details", async () => {
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

    return request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Does",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(200);
  });

  it("returns a 400 for missing firstName or lastName or gender or email or phoneNumber", async () => {
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

    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "",
        lastName: "Does",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Does",
        gender: "",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Does",
        gender: "male",
        email: "",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
    await request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Does",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns  a 400 for invalid email", async () => {
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

    return request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Does",
        gender: "male",
        email: "john.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns  a 400 for invalid gender", async () => {
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

    return request(app)
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Doe",
        gender: "someGender",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });

  it("returns  a 404 for no user if found", async () => {
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

    return request(app)
      .patch(`/api/v1/users/edit-user-details/${"someUserId"}`)
      .send({
        firstName: "Johns",
        lastName: "Doe",
        gender: "male",
        email: "johndoe@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(404);
  });

  it("returns  a 400 for updating to already registered email", async () => {
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
    await prisma.user.create({
      data: {
        firstName: "Wes",
        lastName: "Cock",
        gender: "male",
        email: "wescock@gmail.com",
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
      .patch(`/api/v1/users/edit-user-details/${res.body.user.userId}`)
      .send({
        firstName: "Johns",
        lastName: "Doe",
        gender: "male",
        email: "wescock@gmail.com",
        phoneNumber: "0787489045",
      })
      .set("Authorization", `Bearer ${res.body.accessToken}`)
      .expect(400);
  });
});
