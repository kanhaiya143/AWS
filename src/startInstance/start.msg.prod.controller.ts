import { Body, Controller, Get, Post, Request, Response, Query } from "@nestjs/common";
import { AwsInstanceDetails } from "./instanceDetails.dto";
import { StartAwsInstanceService } from "./start.msg.prod.service";
const logger = require("logger-line-number");

@Controller("startInstance")
export class StartInstanceController {
  constructor(private readonly startAwsInstanceService: StartAwsInstanceService) { }

  @Get()
  async startAwsInstance(@Query("userName") userName: string, @Query("instaNum") instanceNumber: number, @Request() req, @Response() res): Promise<any> {
    logger.log("Got aws start instance request from user in controller");

    await this.startAwsInstanceService.addAwsStartInstanceRequestToQueue(userName, instanceNumber);
    return res.json("To start aws instance job is added to Bull Queue");
  }
}
