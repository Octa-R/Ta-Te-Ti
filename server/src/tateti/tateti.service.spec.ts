import { Test, TestingModule } from '@nestjs/testing';
import { TatetiService } from './tateti.service';

describe('TatetiService', () => {
  let service: TatetiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TatetiService],
    }).compile();

    service = module.get<TatetiService>(TatetiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
