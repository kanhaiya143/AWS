import { Queue } from 'bull';
export declare class StartAwsInstanceService {
    private queue;
    constructor(queue: Queue);
    addAwsStartInstanceRequestToQueue(userName: string, instanceNumber: number): Promise<void>;
}
