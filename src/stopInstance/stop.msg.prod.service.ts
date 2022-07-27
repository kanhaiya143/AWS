import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
const logger = require('logger-line-number')

/* Store the Instance details to Firebase DB */
var firebase = require("firebase-admin");

@Injectable()
export class StopAwsInstanceService {
    constructor(@InjectQueue('aws-request-queue') private queue: Queue) { }

    async addAwsStopInstanceRequestToQueue(userName: string, instanceNumber: number) {
        logger.log("Got a aws stop instance job request to queue");

        /* Collecting aws instance parameters from firestore of InstanceDetails collection */
        const db = firebase.firestore();

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

                logger.log("Fetched the aws running instance details from RunningAwsInstanceDetails firestore collection");

                /* Adding Job to Bull Queue */
                logger.log("Adding stop aws instance job request to Bull Queue");
                this.queue.add('stop-aws-insta-job', { InstanceId: InstanceId });

            })
            .catch((error) => {
                logger.error(`Instance Number: ${instanceNumber} is not running for User Name: ${userName}`);
                logger.error("Error getting document: ", error);
            });

    }
}