import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/Prisma.service";
import { z } from "zod";

// Validacao onde toda query params é uma string
// Por padrao é 1
// Transformo para number
// O pipe é para fazer uma nova validacao onde o que recebemos se torne realmente 1
const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 1000;
    const questions = await this.prisma.question.findMany({
      take: perPage, // Quantos registros eu quero mostrar por pagina
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });
    return { questions };
  }
}
