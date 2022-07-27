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
exports.StopAwsInstanceService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const logger = require('logger-line-number');
var firebase = require("firebase-admin");
let StopAwsInstanceService = class StopAwsInstanceService {
    constructor(queue) {
        this.queue = queue;
    }
    async addAwsStopInstanceRequestToQueue(userName, instanceNumber) {
        logger.log("Got a aws stop instance job request to queue");
        const db = firebase.firestore();
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
            logger.log("Fetched the aws running instance details from RunningAwsInstanceDetails firestore collection");
            logger.log("Adding stop aws instance job request to Bull Queue");
            this.queue.add('stop-aws-insta-job', { InstanceId: InstanceId });
        })
            .catch((error) => {
            logger.error(`Instance Number: ${instanceNumber} is not running for User Name: ${userName}`);
            logger.error("Error getting document: ", error);
        });
    }
};
StopAwsInstanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('aws-request-queue')),
    __metadata("design:paramtypes", [Object])
], StopAwsInstanceService);
exports.StopAwsInstanceService = StopAwsInstanceService;
//# sourceMappingURL=stop.msg.prod.service.js.map