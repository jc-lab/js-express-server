import {ServerModule} from '../server-module';
import {JsExpressServer} from '../server';

let INSTANCE: CloudKmsService;

export type DataKeySpec = 'AES_128' | 'AES_256' | null;
export type PlaintextType = Buffer|Uint8Array|string;
export type CiphertextType = Buffer|Uint8Array|string;

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
    keyId: string,
    plainText: PlaintextType
}

export interface EncryptResponse {
    keyId?: string;
    cipherText: CiphertextType;
}

export interface DecryptParam {
    keyId?: string,
    cipherText: CiphertextType
}

export interface DecryptResponse {
    keyId?: string;
    plainText: PlaintextType;
}

export abstract class CloudKmsService extends ServerModule {
    attachTo(server: JsExpressServer): void {
        INSTANCE = this;
    }

    abstract generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse>;
    abstract encrypt(param: EncryptParam): Promise<EncryptResponse>;
    abstract decrypt(param: DecryptParam): Promise<DecryptResponse>;
}

export function generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse> {
    return INSTANCE.generateDataKey(param);
}

export function encrypt(param: EncryptParam): Promise<EncryptResponse> {
    return INSTANCE.encrypt(param);
}

export function decrypt(param: DecryptParam): Promise<DecryptResponse> {
    return INSTANCE.decrypt(param);
}
