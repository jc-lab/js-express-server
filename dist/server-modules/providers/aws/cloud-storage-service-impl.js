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
    getNative() {
        return this._native;
    }
}
exports.default = CloudStorageServiceImpl;
