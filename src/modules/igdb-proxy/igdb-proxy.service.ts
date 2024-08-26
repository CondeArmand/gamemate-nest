// igdb-proxy.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { IGDBService } from '../igdb/igdb.service';

@Injectable()
export class IGDBProxyService {
  constructor(
    private readonly redisService: RedisService,
    private readonly igdbService: IGDBService,
  ) {}

  async getGames(): Promise<any> {
    const cacheKey = 'igdb:games';
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      try {
        const games = await this.igdbService.fetchGames();
        await this.redisService.set(cacheKey, JSON.stringify(games), 3600); // 1 hora de cache
        return games;
      } catch (error) {
        throw new HttpException(
          'Erro ao buscar jogos da IGDB',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getPopularGames(): Promise<any> {
    const cacheKey = 'igdb:popular-games';
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      // Retorna os dados em cache
      return JSON.parse(cachedData);
    } else {
      try {
        const popularGames = await this.igdbService.fetchPopularGames();
        await this.redisService.set(
          cacheKey,
          JSON.stringify(popularGames),
          3600,
        ); // 1 hora de cache
        return popularGames;
      } catch (error) {
        throw new HttpException(
          'Erro ao buscar jogos populares da IGDB',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
