import { StartAwsInstanceService } from "./start.msg.prod.service";
export declare class StartInstanceController {
    private readonly startAwsInstanceService;
    constructor(startAwsInstanceService: StartAwsInstanceService);
    startAwsInstance(userName: string, instanceNumber: number, req: any, res: any): Promise<any>;
}
