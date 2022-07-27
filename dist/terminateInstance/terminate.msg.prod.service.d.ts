import { Queue } from 'bull';
export declare class TerminateAwsInstanceService {
    private queue;
    constructor(queue: Queue);
    addAwsTerminateInstanceRequestToQueue(userName: string, instanceNumber: number): Promise<void>;
}
