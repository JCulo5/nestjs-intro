import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  format(message: string): string {
    const now = new Date().toISOString();
    return `${now} - ${message}`;
  }
}
