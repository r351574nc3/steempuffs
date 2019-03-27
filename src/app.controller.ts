import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { homedir } from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(): string {
    return ''
  }
}
