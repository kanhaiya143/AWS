import { Job } from "bull";
export declare class AwsMsgQueueConsumer {
    startAwsInstance(job: Job<unknown>): void;
    stopAwsInstance(job: Job<unknown>): void;
    terminateAwsInstance(job: Job<unknown>): void;
}
