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
exports.StartInstance = void 0;
const common_1 = require("@nestjs/common");
const instanceDetails_dto_1 = require("./instanceDetails.dto");
var firebase = require("firebase-admin");
var serviceAccount = require("/Users/kanhaiya/nowgg_dev/nest_proj/nest_crud/awsInstaDB.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});
var AWS = require("aws-sdk");
AWS.config.update({ region: 'ap-south-1' });
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
AWS.config.getCredentials(function (err) {
    if (err) {
        console.log(err.stack);
    }
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});
let StartInstance = class StartInstance {
    async getStartAwsInstance(req, res) {
        const db = firebase.firestore();
        await db.collection('InstanceDetails')
            .get()
            .then((snapshot) => {
            const data = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            delete data[0].id;
            const awsStartInstParams = data[0];
            ec2.runInstances(awsStartInstParams, function (err, awsInstanceResData) {
                if (err) {
                    console.log(err, err.stack);
                }
                else {
                    db.collection('RunningAwsInstanceDetails').add(awsInstanceResData)
                        .then(() => {
                        console.log("Document successfully written!");
                        console.log(awsInstanceResData);
                    })
                        .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                    return res.json(awsInstanceResData);
                }
            });
        })
            .catch((error) => {
            console.error("Error getting document: ", error);
            return res(error);
        });
    }
    async postStartAwsInstance(awsInstanceDetails) {
        console.log(awsInstanceDetails);
        return awsInstanceDetails;
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StartInstance.prototype, "getStartAwsInstance", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [instanceDetails_dto_1.AwsInstanceDetails]),
    __metadata("design:returntype", Promise)
], StartInstance.prototype, "postStartAwsInstance", null);
StartInstance = __decorate([
    (0, common_1.Controller)('startInstance')
], StartInstance);
exports.StartInstance = StartInstance;
//# sourceMappingURL=start.controller.js.map