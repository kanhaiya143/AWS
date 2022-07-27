import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
const logger = require('logger-line-number');

/* Store the Instance details to Firebase DB */
var firebase = require("firebase-admin");

@Injectable()
export class TerminateAwsInstanceService {
    constructor(@InjectQueue('aws-request-queue') private queue: Queue) { }

    async addAwsTerminateInstanceRequestToQueue(userName: string, instanceNumber: number) {
        logger.log("Got a aws terminate instance job request to queue");

        /* Collecting aws instance parameters from firestore of InstanceDetails collection */
        const db = firebase.firestore();
        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);

        await db.collection('RunningAwsInstanceDetails')
            .where('userName', '==', userName)
            .where('instanceNumber', "==", instanceNumber)
            .get()
            .then((snapshot) => {
                const fireStoreData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const InstanceId = [];
                InstanceId.push(fireStoreData[0].awsInstanceResData.Instances[0].InstanceId);

                logger.log("User Name: ", fireStoreData[0].userName);
                logger.log("Instance Number: ", fireStoreData[0].instanceNumber);
                logger.log("Instance ID: ", InstanceId);
                /* Adding Job to Bull Queue */
                logger.log("Adding terminate aws instance job request to Bull Queue");
                this.queue.add('terminate-aws-insta-job', { userName: userName, instanceNumber: instanceNumber, InstanceId: InstanceId });

            })
            .catch((error) => {
                logger.error(`Instance Number: ${instanceNumber} is not running/stopped for User Name: ${userName}`);
                logger.error("Error getting document: ", error);
            });
    }
}