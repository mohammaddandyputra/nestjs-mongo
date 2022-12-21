import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloDetail(name: string): string {
    return `Hello ${name}!`;
  }
}
