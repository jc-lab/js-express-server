import {
    CloudStorageService,
    Config,
    Bucket,
    BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse,
    PutObjectParam, PutObjectResponse, UploadParam, UploadResponse
} from '../../cloud-storage-service'

import path from 'path'
import fs from 'fs'

export default class CloudStorageServiceImpl extends CloudStorageService {
    private _rootPath;

    constructor(config: Config & any) {
        super();
        this._rootPath = path.resolve(config.path);
    }

    createBucket(param: BucketParam): Promise<CreateBucketResponse> {
        return new Promise<CreateBucketResponse>((resolve, reject) => {
            fs.mkdir(path.resolve(this._rootPath, param.bucketName), (err) => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    deleteBucket(param: BucketParam): Promise<DeleteBucketResponse> {
        return new Promise<CreateBucketResponse>((resolve, reject) => {
            fs.rmdir(path.resolve(this._rootPath, param.bucketName), (err) => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    listBuckets(param?: BaseParam): Promise<ListBucketsResponse> {
        const paramRawOutput = param ? param.rawOutput : false;
        return new Promise<ListBucketsResponse>((resolve, reject) => {
            fs.readdir(path.resolve(this._rootPath), async (err, files) => {
                if(err) {
                    reject(err);
                }else{
                    let buckets: Bucket[] = [];
                    for(let file of files) {
                        let dir = path.resolve(this._rootPath, file);
                        let info: fs.Stats = await new Promise((sres, srej) => {
                            fs.lstat(dir, (err, info) => {
                                if(err) {
                                    srej(err);
                                }else{
                                    sres(info);
                                }
                            });
                        });
                        if(info.isDirectory()) {
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
            });
        });
    }

    putObject(param: PutObjectParam): Promise<PutObjectResponse> {
        return new Promise<CreateBucketResponse>((resolve, reject) => {
            fs.writeFile(path.resolve(this._rootPath, param.key), param.body, (err) => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    upload(param: PutObjectParam): Promise<PutObjectResponse> {
        return new Promise<CreateBucketResponse>((resolve, reject) => {
            fs.writeFile(path.resolve(this._rootPath, param.key), param.body, (err) => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    getNative() {
        return null;
    }
}
