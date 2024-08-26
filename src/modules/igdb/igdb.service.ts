// igdb.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from '../redis/redis.service'; // Importa o RedisService

@Injectable()
export class IGDBService {
  private readonly clientId: string;
  private readonly accessToken: string;
  private readonly igdbUrl: string;

  constructor(private readonly redisService: RedisService) {
    this.clientId = process.env.IGDB_CLIENT_ID;
    this.accessToken = process.env.IGDB_ACCESS_TOKEN;
    this.igdbUrl = 'https://api.igdb.com/v4';
  }

  async fetchGames(): Promise<any> {
    const cacheKey = 'igdb:games';
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log('Dados obtidos do Redis');
      return JSON.parse(cachedData);
    }

    try {
      const response = await axios.post(
        `${this.igdbUrl}/games`,
        'fields name, cover.url, summary, first_release_date; where rating > 80;',
        {
          headers: {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain',
          },
        },
      );

      const games = response.data;

      await this.redisService.set(cacheKey, JSON.stringify(games), 604800);

      console.log('Dados obtidos da IGDB e armazenados no Redis');
      return games;
    } catch (error) {
      console.error('Erro ao buscar jogos da IGDB:', error.message);
      throw new HttpException('Erro ao buscar jogos da IGDB', 500);
    }
  }

  async fetchPopularGames(): Promise<any> {
    const cacheKey = 'igdb:popular-games';
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log('Dados obtidos do Redis');
      return JSON.parse(cachedData);
    }

    try {
      const popularityResponse = await axios.post(
        `${this.igdbUrl}/popularity_primitives`,
        'fields game_id,value,popularity_type; sort value desc; limit 10; where popularity_type = 2;',
        {
          headers: {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain',
          },
        },
      );

      if (popularityResponse.status !== 200 || !popularityResponse.data) {
        throw new HttpException(
          'Falha ao carregar os jogos populares',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const gameIds = popularityResponse.data.map(
        (item: any) => item['game_id'],
      );
      if (gameIds.length === 0) {
        console.log('Nenhum ID de jogo popular encontrado');
        return [];
      }

      const gameDetailsResponse = await axios.post(
        `${this.igdbUrl}/games`,
        `fields id,name,cover.image_id; where id = (${gameIds.join(',')});`,
        {
          headers: {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'text/plain',
          },
        },
      );

      if (gameDetailsResponse.status !== 200 || !gameDetailsResponse.data) {
        throw new HttpException(
          'Falha ao carregar os detalhes dos jogos populares',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const gameDetails = gameDetailsResponse.data.map((json: any) => ({
        id: json.id,
        name: json.name,
        coverImageId: json.cover?.image_id,
      }));

      await this.redisService.set(
        cacheKey,
        JSON.stringify(gameDetails),
        604800,
      );
      console.log('Dados obtidos da IGDB e armazenados no Redis');
      return gameDetails;
    } catch (error) {
      console.error('Erro ao buscar jogos populares:', error);
      throw new HttpException(
        `Erro ao buscar jogos populares: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async testPerformanceIgdbVsRedis() {
    const igdbStart = Date.now();
    await this.fetchGames();
    const igdbEnd = Date.now();
    const igdbTime = igdbEnd - igdbStart;

    const redisStart = Date.now();
    await this.fetchGames();
    const redisEnd = Date.now();
    const redisTime = redisEnd - redisStart;

    return {
      igdbTime,
      redisTime,
    };
  }
}
