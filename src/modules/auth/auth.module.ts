// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard'; // Certifique-se de importar o LocalAuthGuard

@Module({
  imports: [
    UserModule, // Certifique-se de que o UserModule esteja importado
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key', // Defina uma chave secreta adequada
      signOptions: { expiresIn: '60m' }, // Token expira em 60 minutos
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, LocalAuthGuard], // Adicione LocalStrategy e LocalAuthGuard aos providers
  controllers: [AuthController],
})
export class AuthModule {}
