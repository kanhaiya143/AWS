export declare class AwsInstanceDetails {
    ImageId: string;
    InstanceType: string;
    KeyName: string;
    MinCount: number;
    MaxCount: number;
    SecurityGroupIds: string;
    TagSpecifications: [
        {
            ResourceType: string;
            Tags: [
                {
                    Key: string;
                    Value: string;
                }
            ];
        },
        {
            ResourceType: string;
            Tags: [
                {
                    Key: string;
                    Value: string;
                }
            ];
        }
    ];
}
