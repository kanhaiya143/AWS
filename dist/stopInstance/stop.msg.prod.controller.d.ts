import { StopAwsInstanceService } from './stop.msg.prod.service';
export declare class StopInstanceController {
    private readonly stopAwsInstanceService;
    constructor(stopAwsInstanceService: StopAwsInstanceService);
    stopAwsInstance(userName: string, instanceNumber: number, req: any, res: any): Promise<any>;
}
