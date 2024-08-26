// igdb-proxy.controller.ts
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IGDBProxyService } from './igdb-proxy.service';

@Controller('igdb')
export class IGDBProxyController {
  constructor(private readonly igdbProxyService: IGDBProxyService) {}

  @Get('games')
  async getGames(@Res() res: Response) {
    try {
      const games = await this.igdbProxyService.getGames();
      return res.status(HttpStatus.OK).json(games);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao obter jogos da IGDB',
      });
    }
  }

  @Get('popular-games')
  async getPopularGames(@Res() res: Response) {
    try {
      const popularGames = await this.igdbProxyService.getPopularGames();
      return res.status(HttpStatus.OK).json(popularGames);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao obter jogos populares da IGDB',
      });
    }
  }
}
