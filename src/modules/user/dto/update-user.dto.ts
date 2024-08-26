// update-user.dto.ts
import { IsOptional, IsString, MinLength } from '@nestjs/class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
