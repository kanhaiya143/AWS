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
exports.StopInstance = void 0;
const common_1 = require("@nestjs/common");
var firebase = require("firebase-admin");
var AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
let StopInstance = class StopInstance {
    async stopAwsInstance(req, res) {
        const db = firebase.firestore();
        await db.collection('RunningAwsInstanceDetails')
            .get()
            .then((snapshot) => {
            const data = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            const InstanceIds = [];
            Object.keys(data).forEach(function (key) {
                const runningAwsInstId = data[key].Instances[0].InstanceId;
                InstanceIds.push(runningAwsInstId);
            });
            ec2.stopInstances({ InstanceIds: InstanceIds }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                else {
                    console.log(data);
                    return res.json(data);
                }
            });
        })
            .catch((error) => {
            console.error("Error getting document: ", error);
            return res(error);
        });
        return 'stop the aws instance';
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StopInstance.prototype, "stopAwsInstance", null);
StopInstance = __decorate([
    (0, common_1.Controller)('stopInstance')
], StopInstance);
exports.StopInstance = StopInstance;
//# sourceMappingURL=stop.controller.js.map