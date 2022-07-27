import { TerminateAwsInstanceService } from './terminate.msg.prod.service';
export declare class TerminateInstanceController {
    private readonly terminateAwsInstanceService;
    constructor(terminateAwsInstanceService: TerminateAwsInstanceService);
    terminateAwsInstance(userName: string, instanceNumber: number, req: any, res: any): Promise<any>;
}
