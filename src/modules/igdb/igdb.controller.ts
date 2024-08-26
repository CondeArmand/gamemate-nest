// igdb.controller.ts
import { Controller, Get } from '@nestjs/common';
import { IGDBService } from './igdb.service';

@Controller('igdb-test')
export class IGDBController {
  constructor(private readonly igdbService: IGDBService) {}

  @Get('games')
  async getGames() {
    return this.igdbService.fetchGames();
  }

  @Get('performance')
  async testPerformance() {
    return this.igdbService.testPerformanceIgdbVsRedis();
  }
}
