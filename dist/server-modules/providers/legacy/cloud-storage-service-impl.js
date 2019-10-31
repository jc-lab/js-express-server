"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this._rootPath = path_1.default.resolve(config.path);
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
            fs_1.default.readdir(path_1.default.resolve(this._rootPath), (err, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                else {
                    let buckets = [];
                    for (let file of files) {
                        let dir = path_1.default.resolve(this._rootPath, file);
                        let info = yield new Promise((sres, srej) => {
                            fs_1.default.lstat(dir, (err, info) => {
                                if (err) {
                                    srej(err);
                                }
                                else {
                                    sres(info);
                                }
                            });
                        });
                        if (info.isDirectory()) {
                            buckets.push({
                                name: file,
                                creationDate: info.ctime
                            });
                        }
                    }
                    resolve({
                        buckets: buckets
                    });
                }
            }));
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
