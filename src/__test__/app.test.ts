import request from "supertest";
import App from "../app";
import { prisma } from "../config/prisma";

const appTest = new App().app;

describe("Connection and GET testing API", () => {
  beforeEach(() => {
    // digunakan untuk menyiapkan program yang ingin dijalankan
    // sebelum menjalankan tiap poin testing
  });

  beforeAll(async () => {
    //digunakan untuk menyiapkan program yang ingin dijalankan
    //sebelum semua proses testing berlangsung
    await prisma.$connect();
  });

  afterEach(() => {
    // digunakan untuk menyiapkan program yang ingin dijalankan
    // sebelum menjalankan tiap poin testing
  });

  afterAll(async () => {
    //digunakan untuk menyiapkan program yang ingin dijalankan
    //sebelum semua proses testing berlangsung
    await prisma.$disconnect();
  });

  // GOOD CASE
  it("Should return welcome message from main route", async () => {
    const response = await request(appTest).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toEqual("<h1>BLOG APP</h1>");
  });

  // BAD CASE
  it("Should return NOT FOUND PAGE", async () => {
    const response = await request(appTest).get("/gaming");

    expect(response.status).toBe(404);
  });

  // TEST SIGN IN SUCCESS
  it("should sign in user account", async () => {
    const response = await request(appTest).post("/user/login").send({
      email: "tahemi2469@confmin.com",
      password: "tahemi2469@confmin.coM",
    });

    // console.log(response.body);
    expect(response.body).toHaveProperty("token");
  });
});
