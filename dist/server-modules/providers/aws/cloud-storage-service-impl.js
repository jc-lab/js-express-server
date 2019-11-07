"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_storage_service_1 = require("../../cloud-storage-service");
const aws_sdk_1 = require("aws-sdk");
function convertBucketsFrom(input) {
    const output = [];
    if (input) {
        for (let o of input) {
            output.push({
                name: o.Name,
                creationDate: o.CreationDate
            });
        }
    }
    return output;
}
function convertOperationFrom(input) {
    switch (input) {
        case 'getObject':
            return 'getObject';
        case 'putObject':
            return 'putObject';
    }
    return null;
}
function convertAcl(input) {
    switch (input) {
        case 'private':
            return 'private';
        case 'public-read':
            return 'public-read';
        case 'public-read-write':
            return 'public-read-write';
        case 'authenticated-read':
            return 'authenticated-read';
        case 'bucket-owner-read':
            return 'bucket-owner-read';
        case 'bucket-owner-full-control':
            return 'bucket-owner-full-control';
    }
    return undefined;
}
class CloudStorageServiceImpl extends cloud_storage_service_1.CloudStorageService {
    constructor(config) {
        super();
        this._native = new aws_sdk_1.S3(config);
    }
    createBucket(param) {
        return new Promise((resolve, reject) => {
            this._native.createBucket(Object.assign({
                Bucket: param.bucketName,
            }, param.etc || {}), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    deleteBucket(param) {
        return new Promise((resolve, reject) => {
            this._native.deleteBucket(Object.assign({
                Bucket: param.bucketName
            }, param.etc || {}), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    listBuckets(param) {
        const paramRawOutput = param ? param.rawOutput : false;
        return new Promise((resolve, reject) => {
            this._native.listBuckets((err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    const output = {
                        raw: paramRawOutput ? data : undefined,
                        buckets: convertBucketsFrom(data.Buckets)
                    };
                    resolve();
                }
            });
        });
    }
    putObject(param) {
        return new Promise((resolve, reject) => {
            this._native.putObject(Object.assign({
                Key: param.key,
                Body: param.body
            }, param.etc), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    upload(param) {
        return new Promise((resolve, reject) => {
            this._native.upload(Object.assign({
                Key: param.key,
                Body: param.body
            }, param.etc), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    getSignedUrl(operation, param) {
        return this._native.getSignedUrlPromise(convertOperationFrom(operation), Object.assign({
            Bucket: param.bucketName,
            Key: param.key,
            ContentMD5: param.contentMd5,
            ContentType: param.contentType,
            ContentDisposition: param.contentDisposition,
            ContentEncoding: param.contentEncoding,
            ContentLanguage: param.contentLanguage
        }, param.etc));
    }
    getNative() {
        return this._native;
    }
}
exports.default = CloudStorageServiceImpl;
