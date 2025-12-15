import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //hash method test (mocks & spies)
  it('should hash password', async () => {
    const mochHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mochHash);
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mochHash);
  });

  //verify method test (mocks & spies)
  it('should verify password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const plainPassword = 'password123';
    const hashedPassword = 'hashed_password';
    const result = await service.verify(plainPassword, hashedPassword);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });
});
