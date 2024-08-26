// igdb-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IGDBService } from './igdb.service';

@Injectable()
export class IGDBSchedulerService {
  private readonly logger = new Logger(IGDBSchedulerService.name);

  constructor(private readonly igdbService: IGDBService) {}


  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    this.logger.log('Executando tarefa de requisição à IGDB');

    let success = false;
    while (!success) {
      try {
        await this.igdbService.fetchGames();
        await this.igdbService.fetchPopularGames();
        this.logger.log('Requisições à IGDB bem-sucedida');
        success = true;
      } catch (error) {
        this.logger.error(
          'Erro ao fazer requisição à IGDB, tentando novamente...',
          error.message,
        );
        await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minuto de espera
      }
    }
  }
}
