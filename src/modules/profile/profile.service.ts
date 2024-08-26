// profile.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Supondo que UserService tenha métodos úteis

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getProfile(userId: string) {
    return this.userService.findUserById(userId);
  }

  async updateProfile(userId: string, updateData: any) {
    // Lógica para atualizar perfil
    return this.userService.updateUser(userId, updateData);
  }
}
