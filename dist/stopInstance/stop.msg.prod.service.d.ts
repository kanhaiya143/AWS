import { Queue } from 'bull';
export declare class StopAwsInstanceService {
    private queue;
    constructor(queue: Queue);
    addAwsStopInstanceRequestToQueue(userName: string, instanceNumber: number): Promise<void>;
}
