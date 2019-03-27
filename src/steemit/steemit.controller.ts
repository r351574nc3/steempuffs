

import { Get, Controller } from '@nestjs/common';
import { SteemitService } from './steemit.service';

/**
 * /steemit/post : posts 
 */
@Controller('steemit')
export class SteemitController {
  constructor(private readonly steemitService: SteemitService) {}

  @Get()
  getActivity(): string {
    return this.steemitService.getActivity();
  }
}
