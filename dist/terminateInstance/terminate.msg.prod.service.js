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
exports.TerminateAwsInstanceService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const logger = require('logger-line-number');
var firebase = require("firebase-admin");
let TerminateAwsInstanceService = class TerminateAwsInstanceService {
    constructor(queue) {
        this.queue = queue;
    }
    async addAwsTerminateInstanceRequestToQueue(userName, instanceNumber) {
        logger.log("Got a aws terminate instance job request to queue");
        const db = firebase.firestore();
        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);
        await db.collection('RunningAwsInstanceDetails')
            .where('userName', '==', userName)
            .where('instanceNumber', "==", instanceNumber)
            .get()
            .then((snapshot) => {
            const fireStoreData = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            const InstanceId = [];
            InstanceId.push(fireStoreData[0].awsInstanceResData.Instances[0].InstanceId);
            logger.log("User Name: ", fireStoreData[0].userName);
            logger.log("Instance Number: ", fireStoreData[0].instanceNumber);
            logger.log("Instance ID: ", InstanceId);
            logger.log("Adding terminate aws instance job request to Bull Queue");
            this.queue.add('terminate-aws-insta-job', { userName: userName, instanceNumber: instanceNumber, InstanceId: InstanceId });
        })
            .catch((error) => {
            logger.error(`Instance Number: ${instanceNumber} is not running/stopped for User Name: ${userName}`);
            logger.error("Error getting document: ", error);
        });
    }
};
TerminateAwsInstanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('aws-request-queue')),
    __metadata("design:paramtypes", [Object])
], TerminateAwsInstanceService);
exports.TerminateAwsInstanceService = TerminateAwsInstanceService;
//# sourceMappingURL=terminate.msg.prod.service.js.map