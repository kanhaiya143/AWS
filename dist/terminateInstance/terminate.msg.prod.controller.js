"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminateInstanceController = void 0;
const common_1 = require("@nestjs/common");
const terminate_msg_prod_service_1 = require("./terminate.msg.prod.service");
const logger = require('logger-line-number');
var firebase = require("firebase-admin");
var AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
let TerminateInstanceController = class TerminateInstanceController {
    constructor(terminateAwsInstanceService) {
        this.terminateAwsInstanceService = terminateAwsInstanceService;
    }
    async terminateAwsInstance(userName, instanceNumber, req, res) {
        logger.log("Got aws terminate instance request from user in controller");
        await this.terminateAwsInstanceService.addAwsTerminateInstanceRequestToQueue(userName, instanceNumber);
        return res.json("To terminate aws instance job is added to Bull Queue");
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("userName")),
    __param(1, (0, common_1.Query)("instaNum")),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], TerminateInstanceController.prototype, "terminateAwsInstance", null);
TerminateInstanceController = __decorate([
    (0, common_1.Controller)('terminateInstance'),
    __metadata("design:paramtypes", [terminate_msg_prod_service_1.TerminateAwsInstanceService])
], TerminateInstanceController);
exports.TerminateInstanceController = TerminateInstanceController;
//# sourceMappingURL=terminate.msg.prod.controller.js.map