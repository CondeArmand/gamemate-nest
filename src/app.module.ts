// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IGDBModule } from './modules/igdb/igdb.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IGDBProxyModule } from './modules/igdb-proxy/igdb-proxy.module';

const ENV = process.env.NODE_ENV;
console.log('ENV', ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ProfileModule,
    IGDBModule,
    RedisModule,
    IGDBProxyModule,
  ],
})
export class AppModule {}
