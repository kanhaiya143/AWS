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
exports.StopInstanceController = void 0;
const common_1 = require("@nestjs/common");
const stop_msg_prod_service_1 = require("./stop.msg.prod.service");
const logger = require('logger-line-number');
let StopInstanceController = class StopInstanceController {
    constructor(stopAwsInstanceService) {
        this.stopAwsInstanceService = stopAwsInstanceService;
    }
    async stopAwsInstance(userName, instanceNumber, req, res) {
        logger.log("Got aws stop instance request from user in controller");
        await this.stopAwsInstanceService.addAwsStopInstanceRequestToQueue(userName, instanceNumber);
        return res.json("To stop aws instance job is added to Bull Queue");
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
], StopInstanceController.prototype, "stopAwsInstance", null);
StopInstanceController = __decorate([
    (0, common_1.Controller)('stopInstance'),
    __metadata("design:paramtypes", [stop_msg_prod_service_1.StopAwsInstanceService])
], StopInstanceController);
exports.StopInstanceController = StopInstanceController;
//# sourceMappingURL=stop.msg.prod.controller.js.map