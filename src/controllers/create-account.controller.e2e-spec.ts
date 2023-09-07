import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/Prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("CreateAccountController E2E Tests", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // rodar a aplicacao de forma programatica
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  test("[POST] /accounts ", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "john@email.com",
      password: "1234",
    });
    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "john@email.com",
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});
