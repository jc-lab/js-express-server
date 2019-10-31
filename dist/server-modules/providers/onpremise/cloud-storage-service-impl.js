"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_storage_service_1 = require("../../cloud-storage-service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CloudStorageServiceImpl extends cloud_storage_service_1.CloudStorageService {
    constructor(config) {
        super();
        this._rootPath = config.path;
    }
    createBucket(param) {
        return new Promise((resolve, reject) => {
            fs_1.default.mkdir(path_1.default.resolve(this._rootPath, param.bucketName), (err) => {
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
            fs_1.default.rmdir(path_1.default.resolve(this._rootPath, param.bucketName), (err) => {
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
            fs_1.default.readdir(path_1.default.resolve(this._rootPath), (err, files) => {
                console.log("files : ", files);
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    putObject(param) {
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(path_1.default.resolve(this._rootPath, param.key), param.body, (err) => {
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
            fs_1.default.writeFile(path_1.default.resolve(this._rootPath, param.key), param.body, (err) => {
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
        return null;
    }
}
exports.default = CloudStorageServiceImpl;
