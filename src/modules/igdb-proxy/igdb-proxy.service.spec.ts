// igdb-proxy.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { IGDBProxyService } from './igdb-proxy.service';
import { RedisService } from '../redis/redis.service';
import { IGDBService } from '../igdb/igdb.service';

describe('IGDBProxyService Performance Test', () => {
  let igdbProxyService: IGDBProxyService;
  let redisService: RedisService;
  let igdbService: IGDBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IGDBProxyService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: IGDBService,
          useValue: {
            fetchGames: jest.fn(),
          },
        },
      ],
    }).compile();

    igdbProxyService = module.get<IGDBProxyService>(IGDBProxyService);
    redisService = module.get<RedisService>(RedisService);
    igdbService = module.get<IGDBService>(IGDBService);
  });

  it('should compare performance between IGDB API and Redis', async () => {
    const mockGamesData = [{ id: 1, name: 'Test Game' }];

    // Mocking Redis and IGDB service methods
    redisService.get = jest
      .fn()
      .mockResolvedValue(JSON.stringify(mockGamesData));
    igdbService.fetchGames = jest.fn().mockResolvedValue(mockGamesData);

    // Measure time for Redis request
    const redisStart = process.hrtime();
    const redisResult = await igdbProxyService.getGames();
    const redisEnd = process.hrtime(redisStart);

    console.log(
      `Redis request time: ${redisEnd[0] * 1000 + redisEnd[1] / 1e6} ms`,
    );

    // Clear Redis cache to force IGDB API call
    redisService.get = jest.fn().mockResolvedValue(null);

    // Measure time for IGDB API request
    const igdbStart = process.hrtime();
    const igdbResult = await igdbProxyService.getGames();
    const igdbEnd = process.hrtime(igdbStart);

    console.log(
      `IGDB API request time: ${igdbEnd[0] * 1000 + igdbEnd[1] / 1e6} ms`,
    );

    // Compare results (they should be the same as mock data)
    expect(redisResult).toEqual(mockGamesData);
    expect(igdbResult).toEqual(mockGamesData);
  });
});
