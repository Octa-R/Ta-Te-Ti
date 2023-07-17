import { Test, TestingModule } from '@nestjs/testing';
import { TatetiGateway } from './tateti.gateway';

describe('TatetiGateway', () => {
  let gateway: TatetiGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TatetiGateway],
    }).compile();

    gateway = module.get<TatetiGateway>(TatetiGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
