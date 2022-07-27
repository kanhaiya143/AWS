import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
const logger = require('logger-line-number');

/* Store the Instance details to Firebase DB */
var firebase = require('firebase-admin');

var serviceAccount = require('/Users/kanhaiya/nowgg_dev/nest_proj/awsInstanceBullQueue/awsInstaDB.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

/* Load the SDK for JavaScript */
var AWS = require('aws-sdk');

/* Set the region (Mumbai)*/
AWS.config.update({ region: 'ap-south-1' });

/* Create an ec2 object */
const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

AWS.config.getCredentials(function (err) {
  if (err) {
    logger.log(err.stack);
  } else {
    logger.log('Access key:', AWS.config.credentials.accessKeyId);
  }
});

@Injectable()
export class StartAwsInstanceService {
  constructor(@InjectQueue('aws-request-queue') private queue: Queue) { }

  async addAwsStartInstanceRequestToQueue(userName: string, instanceNumber: number) {
    logger.log('Got an add aws start instance job request to queue');

    /* Collecting aws instance parameters from firestore of InstanceDetails collection */
    const db = firebase.firestore();

    // await db.collection('RunningAwsInstanceDetails')
    //   .where('userName', '==', userName)
    //   .where('instanceNumber', "==", instanceNumber)
    //   .get()
    //   .then((snapshot) => {
    //     const fireStoreData = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     const InstanceId = [];
    //     InstanceId.push(fireStoreData[0].awsInstanceResData.Instances[0].InstanceId);

    //     logger.error(`Requested Instance Number: ${fireStoreData[0].instanceNumber} of User Name: ${fireStoreData[0].userName} is already running and AWS Instance ID is ${InstanceId}`);
    //   })

    await db.collection('InstanceDetails')
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        /* Removing the ID field from Data*/
        delete data[0].id;
        const awsStartInstParams = data[0];

        logger.log('Fetched the aws instance details from InstanceDetails firestore collection');

        /* Adding Job to Bull Queue */
        logger.log('Adding start aws instance job request to Bull Queue');
        this.queue.add('start-aws-insta-job', { userName: userName, instanceNumber: instanceNumber, instanceDetails: awsStartInstParams });
      })
      .catch((error) => {
        logger.error('Error getting document: ', error);
      });
  }
}
