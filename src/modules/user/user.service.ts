// user.service.ts
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      // Tratamento de erro para conflito, ex: email ou username já existe
      if (error.code === 'P2002') {
        throw new ConflictException('Email ou username já existem');
      }
      throw error;
    }
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUserById(id: string): Promise<User | null> {
    if (!id) {
      console.error('O ID fornecido é inválido:', id);
      throw new BadRequestException('ID inválido fornecido');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      console.error('Usuário não encontrado com ID:', id);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
