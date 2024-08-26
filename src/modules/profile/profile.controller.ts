// profile.controller.ts
import { Controller, Get, Put, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(@Request() req: any, @Body() updateData: any) {
    // Atualiza o perfil do usuário autenticado
    return this.profileService.updateProfile(req.user.id, updateData);
  }
}
