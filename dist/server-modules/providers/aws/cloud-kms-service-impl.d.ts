import { CloudKmsService, Config, GenerateDataKeyParam, GenerateDataKeyResponse, EncryptParam, EncryptResponse, DecryptParam, DecryptResponse } from '../../cloud-kms-service';
export default class CloudKmsServiceImpl extends CloudKmsService {
    private _config;
    private _awsKms?;
    constructor(config: Config & any);
    generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse>;
    encrypt(param: EncryptParam): Promise<EncryptResponse>;
    decrypt(param: DecryptParam): Promise<DecryptResponse>;
}
//# sourceMappingURL=cloud-kms-service-impl.d.ts.map