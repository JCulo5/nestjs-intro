import { Expose } from 'class-transformer/types/decorators/expose.decorator';

export class AdminResponse {
  constructor(private readonly partial?: Partial<AdminResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  message: string;
}
