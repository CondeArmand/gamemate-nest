// igdb.module.ts
import { Module } from '@nestjs/common';
import { IGDBService } from './igdb.service';
import { IGDBSchedulerService } from './igdb-scheduler.service';
import { IGDBController } from './igdb.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [IGDBService, IGDBSchedulerService],
  controllers: [IGDBController],
  exports: [IGDBService],
})
export class IGDBModule {}
