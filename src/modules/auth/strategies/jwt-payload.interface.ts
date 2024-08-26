// auth/strategies/jwt-payload.interface.ts
export interface JwtPayload {
  username: string;
  sub: string; // Normalmente, o ID do usuário
}
