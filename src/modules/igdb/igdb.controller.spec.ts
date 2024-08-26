import { Test, TestingModule } from '@nestjs/testing';
import { IGDBController } from './igdb.controller';

describe('IgdbController', () => {
  let controller: IGDBController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IGDBController],
    }).compile();

    controller = module.get<IGDBController>(IGDBController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
