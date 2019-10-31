"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_kms_service_1 = require("../../cloud-kms-service");
const aws_sdk_1 = require("aws-sdk");
class CloudKmsServiceImpl extends cloud_kms_service_1.CloudKmsService {
    constructor(config) {
        super();
        this._config = config;
        if (config.provider == 'aws') {
            this._awsKms = new aws_sdk_1.KMS(Object.assign({ apiVersion: '2014-11-01' }, config));
        }
    }
    generateDataKey(param) {
        return new Promise((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms)
                    return;
                let providerParams = {
                    KeyId: param.keyId,
                    KeySpec: param.keySpec,
                };
                providerParams = Object.assign(providerParams, param.params || {});
                this._awsKms.generateDataKey(providerParams, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if ((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array))) {
                        reject(Error('Unknown plaintext type'));
                        return;
                    }
                    if ((typeof data.CiphertextBlob != 'string') && (!Buffer.isBuffer(data.CiphertextBlob)) && (!(data.CiphertextBlob instanceof Uint8Array))) {
                        reject(Error('Unknown ciphertext type'));
                        return;
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
    encrypt(param) {
        return new Promise((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms)
                    return;
                this._awsKms.encrypt({
                    KeyId: param.keyId,
                    Plaintext: param.plainText
                }, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (!Buffer.isBuffer(data.CiphertextBlob)) {
                        reject(Error('Unknown ciphertext type'));
                        return;
                    }
                    resolve({
                        keyId: data.KeyId,
                        cipherText: data.CiphertextBlob
                    });
                });
            }
        });
    }
    decrypt(param) {
        return new Promise((resolve, reject) => {
            if (this._config.provider == 'aws') {
                if (!this._awsKms)
                    return;
                this._awsKms.decrypt({
                    CiphertextBlob: param.cipherText
                }, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if ((typeof data.Plaintext != 'string') && (!Buffer.isBuffer(data.Plaintext)) && (!(data.Plaintext instanceof Uint8Array))) {
                        reject(Error('Unknown plaintext type'));
                        return;
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
exports.default = CloudKmsServiceImpl;
