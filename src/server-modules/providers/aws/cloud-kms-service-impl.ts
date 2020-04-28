import {
  CloudKmsService,
  Config,
  DataKeySpec,
  PlaintextType,
  CiphertextType,
  GenerateDataKeyParam, GenerateDataKeyResponse,
  EncryptParam, EncryptResponse,
  DecryptParam, DecryptResponse
} from '../../cloud-kms-service';

import {KMS as AWS_KMS, KMS} from 'aws-sdk';
import {JsExpressServer} from '../../../server';

export default class CloudKmsServiceImpl extends CloudKmsService {
  private _config: Config;

  private _awsKms?: AWS_KMS;

  constructor(config: Config & any) {
    super();
    this._config = config;

    if (config.provider == 'aws') {
      this._awsKms = new AWS_KMS(Object.assign({apiVersion: '2014-11-01'}, config));
    }
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
          if (err) {
            reject(err);
            return ;
          }
          if ((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array)))
          {
            reject(Error('Unknown plaintext type'));
            return ;
          }
          if ((typeof data.CiphertextBlob != 'string') && (!Buffer.isBuffer(data.CiphertextBlob)) && (!(data.CiphertextBlob instanceof Uint8Array)))
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
          if (err) {
            reject(err);
            return ;
          }
          if (!Buffer.isBuffer(data.CiphertextBlob))
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
          if (err) {
            reject(err);
            return ;
          }
          if ((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array)))
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
