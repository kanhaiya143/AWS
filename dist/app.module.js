"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bull_1 = require("@nestjs/bull");
const start_msg_prod_service_1 = require("./startInstance/start.msg.prod.service");
const start_msg_prod_controller_1 = require("./startInstance/start.msg.prod.controller");
const aws_cons_queue_1 = require("./aws.cons.queue");
const stop_msg_prod_service_1 = require("./stopInstance/stop.msg.prod.service");
const stop_msg_prod_controller_1 = require("./stopInstance/stop.msg.prod.controller");
const terminate_msg_prod_controller_1 = require("./terminateInstance/terminate.msg.prod.controller");
const terminate_msg_prod_service_1 = require("./terminateInstance/terminate.msg.prod.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.forRoot({
                redis: {
                    host: 'localhost',
                    port: 6379,
                },
            }),
            bull_1.BullModule.registerQueue({
                name: 'aws-request-queue'
            })
        ],
        controllers: [app_controller_1.AppController, start_msg_prod_controller_1.StartInstanceController, stop_msg_prod_controller_1.StopInstanceController, terminate_msg_prod_controller_1.TerminateInstanceController],
        providers: [app_service_1.AppService, start_msg_prod_service_1.StartAwsInstanceService, stop_msg_prod_service_1.StopAwsInstanceService, terminate_msg_prod_service_1.TerminateAwsInstanceService, aws_cons_queue_1.AwsMsgQueueConsumer],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map