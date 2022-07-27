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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsMsgQueueConsumer = void 0;
const bull_1 = require("@nestjs/bull");
const logger = require('logger-line-number');
var firebase = require("firebase-admin");
var AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
let AwsMsgQueueConsumer = class AwsMsgQueueConsumer {
    startAwsInstance(job) {
        logger.log("Dequeue the start aws instance job request from Bull Queue");
        const db = firebase.firestore();
        let data = job.data;
        const userName = data.userName;
        const instanceNumber = data.instanceNumber;
        const awsStartInstParams = data.instanceDetails;
        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);
        logger.log("awsStartInstParams: ", awsStartInstParams);
        ec2.runInstances(awsStartInstParams, function (err, awsInstanceResData) {
            if (err) {
                logger.error(err, err.stack);
            }
            else {
                logger.log("Aws instance is successfully started ");
                db.collection('RunningAwsInstanceDetails').add({ userName: userName, instanceNumber: instanceNumber, awsInstanceResData: awsInstanceResData })
                    .then(() => {
                    logger.log("Response is stored in RunningAwsInstanceDetails firestire collection");
                    logger.log(awsInstanceResData);
                })
                    .catch((error) => {
                    logger.error("Error writing document: ", error);
                });
            }
        });
    }
    stopAwsInstance(job) {
        logger.log("Dequeue the stop aws instance job request from Bull Queue");
        const db = firebase.firestore();
        let data = job.data;
        const InstanceId = data.InstanceId;
        logger.log("Instance ID: ", InstanceId);
        ec2.stopInstances({ InstanceIds: InstanceId }, function (err, awsInstanceResData) {
            if (err) {
                logger.error(err, err.stack);
            }
            else {
                logger.log("Aws instance is successfully stopped");
                logger.log(awsInstanceResData);
            }
        });
    }
    terminateAwsInstance(job) {
        logger.log("Dequeue the terminate aws instance job request from Bull Queue");
        const db = firebase.firestore();
        let data = job.data;
        const InstanceId = data.InstanceId;
        const userName = data.userName;
        const instanceNumber = data.instanceNumber;
        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);
        logger.log("awsStartInstParams: ", InstanceId);
        ec2.terminateInstances({ InstanceIds: InstanceId }, function (err, data) {
            if (err) {
                logger.error(err, err.stack);
            }
            else {
                db.collection('RunningAwsInstanceDetails')
                    .where('userName', '==', userName)
                    .where('instanceNumber', "==", instanceNumber)
                    .get()
                    .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                    logger.log(`Successfully terminated the running/stopped aws instances & Deleted running/stopped instance ID: ${InstanceId} from firestore`);
                })
                    .catch((error) => {
                    logger.error("No Running/Stopped instances present: ", error);
                });
            }
        });
    }
};
__decorate([
    (0, bull_1.Process)('start-aws-insta-job'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AwsMsgQueueConsumer.prototype, "startAwsInstance", null);
__decorate([
    (0, bull_1.Process)('stop-aws-insta-job'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AwsMsgQueueConsumer.prototype, "stopAwsInstance", null);
__decorate([
    (0, bull_1.Process)('terminate-aws-insta-job'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AwsMsgQueueConsumer.prototype, "terminateAwsInstance", null);
AwsMsgQueueConsumer = __decorate([
    (0, bull_1.Processor)('aws-request-queue')
], AwsMsgQueueConsumer);
exports.AwsMsgQueueConsumer = AwsMsgQueueConsumer;
//# sourceMappingURL=aws.cons.queue.js.map