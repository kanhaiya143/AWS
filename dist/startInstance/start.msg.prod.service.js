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
exports.StartAwsInstanceService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const logger = require('logger-line-number');
var firebase = require('firebase-admin');
var serviceAccount = require('/Users/kanhaiya/nowgg_dev/nest_proj/awsInstanceBullQueue/awsInstaDB.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});
var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
AWS.config.getCredentials(function (err) {
    if (err) {
        logger.log(err.stack);
    }
    else {
        logger.log('Access key:', AWS.config.credentials.accessKeyId);
    }
});
let StartAwsInstanceService = class StartAwsInstanceService {
    constructor(queue) {
        this.queue = queue;
    }
    async addAwsStartInstanceRequestToQueue(userName, instanceNumber) {
        logger.log('Got an add aws start instance job request to queue');
        const db = firebase.firestore();
        await db.collection('InstanceDetails')
            .get()
            .then((snapshot) => {
            const data = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            delete data[0].id;
            const awsStartInstParams = data[0];
            logger.log('Fetched the aws instance details from InstanceDetails firestore collection');
            logger.log('Adding start aws instance job request to Bull Queue');
            this.queue.add('start-aws-insta-job', { userName: userName, instanceNumber: instanceNumber, instanceDetails: awsStartInstParams });
        })
            .catch((error) => {
            logger.error('Error getting document: ', error);
        });
    }
};
StartAwsInstanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('aws-request-queue')),
    __metadata("design:paramtypes", [Object])
], StartAwsInstanceService);
exports.StartAwsInstanceService = StartAwsInstanceService;
//# sourceMappingURL=start.msg.prod.service.js.map