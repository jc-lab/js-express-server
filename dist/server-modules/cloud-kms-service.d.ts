/// <reference types="node" />
import { ServerModule } from '../server-module';
import { JsExpressServer } from '../server';
export declare type DataKeySpec = 'AES_128' | 'AES_256' | null;
export declare type PlaintextType = Buffer | Uint8Array | string;
export declare type CiphertextType = Buffer | Uint8Array | string;
export interface Config {
    provider: 'aws' | 'gcp';
    region?: string;
}
export interface GenerateDataKeyParam {
    keyId: string;
    keySpec: DataKeySpec;
    params?: any;
}
export interface GenerateDataKeyResponse {
    keyId?: string;
    plainText?: PlaintextType;
    cipherText?: CiphertextType;
}
export interface EncryptParam {
    keyId: string;
    plainText: PlaintextType;
}
export interface EncryptResponse {
    keyId?: string;
    cipherText: CiphertextType;
}
export interface DecryptParam {
    keyId?: string;
    cipherText: CiphertextType;
}
export interface DecryptResponse {
    keyId?: string;
    plainText: PlaintextType;
}
export declare abstract class CloudKmsService extends ServerModule {
    attachTo(server: JsExpressServer): void;
    abstract generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse>;
    abstract encrypt(param: EncryptParam): Promise<EncryptResponse>;
    abstract decrypt(param: DecryptParam): Promise<DecryptResponse>;
}
export declare function generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse>;
export declare function encrypt(param: EncryptParam): Promise<EncryptResponse>;
export declare function decrypt(param: DecryptParam): Promise<DecryptResponse>;
//# sourceMappingURL=cloud-kms-service.d.ts.map