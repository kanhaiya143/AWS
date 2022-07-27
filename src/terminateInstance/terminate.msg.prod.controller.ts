import { Controller, Get, Response, Request, Query } from '@nestjs/common';
import { TerminateAwsInstanceService } from './terminate.msg.prod.service';
const logger = require('logger-line-number');

/* Store the Instance details to Firebase DB */
var firebase = require("firebase-admin");

/* Load the SDK for JavaScript */
var AWS = require("aws-sdk");

/* Create an ec2 object */
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

@Controller('terminateInstance')
export class TerminateInstanceController {
  constructor(private readonly terminateAwsInstanceService: TerminateAwsInstanceService) { }

  @Get()
  async terminateAwsInstance(@Query("userName") userName: string, @Query("instaNum") instanceNumber: number, @Request() req, @Response() res): Promise<any> {
    logger.log("Got aws terminate instance request from user in controller");

    await this.terminateAwsInstanceService.addAwsTerminateInstanceRequestToQueue(userName, instanceNumber);
    return res.json("To terminate aws instance job is added to Bull Queue");
  }
}
