// redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClient;

  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redisClient.on('connect', () => {
      console.log('Conectado ao Redis');
    });

    this.redisClient.on('error', (err) => {
      console.error('Erro de conexão com o Redis:', err);
    });
  }

  getClient(): RedisClient {
    return this.redisClient;
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
    console.log('Desconectado do Redis');
  }
}
