import { Test, TestingModule } from '@nestjs/testing';
import { Tateti } from './tateti';

describe('Tateti', () => {
  let provider: Tateti;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Tateti],
    }).compile();

    provider = module.get<Tateti>(Tateti);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
