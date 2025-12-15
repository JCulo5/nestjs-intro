import { Expose } from 'class-transformer/types/decorators/expose.decorator';

export class LoginResponse {
  constructor(private readonly partial?: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  accessToken: string;
}
