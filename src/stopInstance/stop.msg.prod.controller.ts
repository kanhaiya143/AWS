import { Controller, Get, Request, Response, Query } from '@nestjs/common';
import { StopAwsInstanceService } from './stop.msg.prod.service';
const logger = require('logger-line-number')

@Controller('stopInstance')
export class StopInstanceController {
  constructor(private readonly stopAwsInstanceService: StopAwsInstanceService) { }

  @Get()
  async stopAwsInstance(@Query("userName") userName: string, @Query("instaNum") instanceNumber: number, @Request() req, @Response() res): Promise<any> {
    logger.log("Got aws stop instance request from user in controller");

    await this.stopAwsInstanceService.addAwsStopInstanceRequestToQueue(userName, instanceNumber);
    return res.json("To stop aws instance job is added to Bull Queue");
  }
}
