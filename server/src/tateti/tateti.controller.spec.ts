import { Test, TestingModule } from '@nestjs/testing';
import { TatetiController } from './tateti.controller';

describe('TatetiController', () => {
  let controller: TatetiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TatetiController],
    }).compile();

    controller = module.get<TatetiController>(TatetiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
