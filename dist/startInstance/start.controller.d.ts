import { AwsInstanceDetails } from './instanceDetails.dto';
export declare class StartInstance {
    getStartAwsInstance(req: any, res: any): Promise<any>;
    postStartAwsInstance(awsInstanceDetails: AwsInstanceDetails): Promise<any>;
}
