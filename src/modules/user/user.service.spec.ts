import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'test', nickname: 'test' };
      const updatedUser = { id: '1', ...updateUserDto };

      prismaService.user.update = jest.fn().mockResolvedValue(updatedUser);

      const result = await userService.updateUser('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deletedUser = { id: '1', email: 'test@example.com' };

      prismaService.user.delete = jest.fn().mockResolvedValue(deletedUser);

      const result = await userService.deleteUser('1');
      expect(result).toEqual(deletedUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ];

      prismaService.user.findMany = jest.fn().mockResolvedValue(users);

      const result = await userService.findAllUsers();
      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });
});
