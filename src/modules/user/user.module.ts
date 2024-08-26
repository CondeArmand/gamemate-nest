// user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Certifique-se de incluir o PrismaService se estiver usando Prisma

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService], // Adicione o PrismaService se necessário
  exports: [UserService], // Certifique-se de exportar o UserService
})
export class UserModule {}
