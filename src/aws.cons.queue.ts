import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

const logger = require('logger-line-number')

/* Store the Instance details to Firebase DB */
var firebase = require("firebase-admin");

/* Load the SDK for JavaScript */
var AWS = require("aws-sdk");

/* Create an ec2 object */
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

@Processor('aws-request-queue')
export class AwsMsgQueueConsumer {

    @Process('start-aws-insta-job')
    startAwsInstance(job: Job<unknown>) {
        logger.log("Dequeue the start aws instance job request from Bull Queue");

        /* To start an EC2 instance */
        const db = firebase.firestore();
        let data: any = job.data;
        const userName = data.userName;
        const instanceNumber = data.instanceNumber;
        const awsStartInstParams = data.instanceDetails;

        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);
        logger.log("awsStartInstParams: ", awsStartInstParams);

        ec2.runInstances(awsStartInstParams, function (err, awsInstanceResData) {
            if (err) {
                logger.error(err, err.stack);
            } else {
                logger.log("Aws instance is successfully started ");
                /* Add response after creating instnace to different firestore table */
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

    @Process('stop-aws-insta-job')
    stopAwsInstance(job: Job<unknown>) {
        logger.log("Dequeue the stop aws instance job request from Bull Queue");

        const db = firebase.firestore();
        let data: any = job.data;
        const InstanceId = data.InstanceId;

        logger.log("Instance ID: ", InstanceId)

        /* To stop EC2 instance */
        ec2.stopInstances({ InstanceIds: InstanceId }, function (err, awsInstanceResData) {
            if (err) {
                logger.error(err, err.stack);
            } else {
                logger.log("Aws instance is successfully stopped");
                logger.log(awsInstanceResData);
            }
        });
    }

    @Process('terminate-aws-insta-job')
    terminateAwsInstance(job: Job<unknown>) {
        logger.log("Dequeue the terminate aws instance job request from Bull Queue");

        const db = firebase.firestore();
        let data: any = job.data;
        const InstanceId = data.InstanceId;
        const userName = data.userName;
        const instanceNumber = data.instanceNumber;

        logger.log("User Name: ", userName);
        logger.log("Instance Number: ", instanceNumber);
        logger.log("awsStartInstParams: ", InstanceId);

        /* To terminate EC2 instance */
        ec2.terminateInstances({ InstanceIds: InstanceId }, function (err, data) {
            if (err) {
                logger.error(err, err.stack);
            } else {
                /* Deleting the collection once aws instance is terminated */
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


}