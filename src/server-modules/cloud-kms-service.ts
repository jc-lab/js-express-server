import {ServerModule} from '../server-module';
import {JsExpressServer} from '../server';

import { KMS as AWS_KMS } from 'aws-sdk'

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

export class CloudKmsService extends ServerModule {
    private _config: Config;

    private _awsKms?: AWS_KMS;

    constructor(config: Config & any) {
        super();
        this._config = config;

        if(config.provider == 'aws') {
            this._awsKms = new AWS_KMS(Object.assign({apiVersion: '2014-11-01'}, config));
        }
    }

    attachTo(server: JsExpressServer): void {
        INSTANCE = this;
    }

    generateDataKey(param: GenerateDataKeyParam): Promise<GenerateDataKeyResponse> {
        return new Promise<GenerateDataKeyResponse>((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms) return;
                let providerParams = {
                    KeyId: param.keyId,
                    KeySpec: param.keySpec,
                };
                providerParams = Object.assign(providerParams, param.params || {});
                this._awsKms.generateDataKey(providerParams as AWS_KMS.Types.GenerateDataKeyRequest, (err, data: AWS_KMS.Types.GenerateDataKeyResponse) => {
                    if(err) {
                        reject(err);
                        return ;
                    }
                    if((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array)))
                    {
                        reject(Error('Unknown plaintext type'));
                        return ;
                    }
                    if((typeof data.CiphertextBlob != 'string') && (!Buffer.isBuffer(data.CiphertextBlob)) && (!(data.CiphertextBlob instanceof Uint8Array)))
                    {
                        reject(Error('Unknown ciphertext type'));
                        return ;
                    }
                    resolve({
                        keyId: data.KeyId,
                        plainText: data.Plaintext,
                        cipherText: data.CiphertextBlob
                    });
                });
            }
        });
    }

    encrypt(param: EncryptParam): Promise<EncryptResponse> {
        return new Promise<EncryptResponse>((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms) return;
                this._awsKms.encrypt({
                    KeyId: param.keyId,
                    Plaintext: param.plainText
                }, (err, data) => {
                    if(err) {
                        reject(err);
                        return ;
                    }
                    if(!Buffer.isBuffer(data.CiphertextBlob))
                    {
                        reject(Error('Unknown ciphertext type'));
                        return ;
                    }
                    resolve({
                        keyId: data.KeyId,
                        cipherText: data.CiphertextBlob
                    });
                });
            }
        });
    }

    decrypt(param: DecryptParam): Promise<DecryptResponse> {
        return new Promise<DecryptResponse>((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms) return;
                this._awsKms.decrypt({
                    CiphertextBlob: param.cipherText
                }, (err, data) => {
                    if(err) {
                        reject(err);
                        return ;
                    }
                    if((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array)))
                    {
                        reject(Error('Unknown plaintext type'));
                        return ;
                    }
                    resolve({
                        keyId: data.KeyId,
                        plainText: data.Plaintext
                    });
                });
            }
        });
    }
}

export function cloudKmsService(config: Config & any): CloudKmsService {
    return new CloudKmsService(config);
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
