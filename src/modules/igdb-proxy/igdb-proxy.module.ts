// igdb-proxy.module.ts
import { Module } from '@nestjs/common';
import { IGDBProxyService } from './igdb-proxy.service';
import { IGDBProxyController } from './igdb-proxy.controller';
import { RedisModule } from '../redis/redis.module';
import { IGDBModule } from '../igdb/igdb.module';

@Module({
  imports: [RedisModule, IGDBModule], // Importa RedisModule e IGDBModule
  providers: [IGDBProxyService], // Registra o IGDBProxyService
  controllers: [IGDBProxyController], // Registra o IGDBProxyController
})
export class IGDBProxyModule {}
