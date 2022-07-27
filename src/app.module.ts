import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { StartAwsInstanceService } from './startInstance/start.msg.prod.service';
import { StartInstanceController } from './startInstance/start.msg.prod.controller';
import { AwsMsgQueueConsumer } from './aws.cons.queue';
import { StopAwsInstanceService } from './stopInstance/stop.msg.prod.service';
import { StopInstanceController } from './stopInstance/stop.msg.prod.controller';
import { TerminateInstanceController } from './terminateInstance/terminate.msg.prod.controller';
import { TerminateAwsInstanceService } from './terminateInstance/terminate.msg.prod.service';

@Module({
  imports: [
    BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
  BullModule.registerQueue({
    name:'aws-request-queue'
  })],
  controllers: [AppController, StartInstanceController, StopInstanceController, TerminateInstanceController],
  providers: [AppService, StartAwsInstanceService, StopAwsInstanceService, TerminateAwsInstanceService,AwsMsgQueueConsumer],
})
export class AppModule {}
