import {
  CloudStorageService,
  Config,
  Bucket,
  BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse,
  PutObjectParam, PutObjectResponse, UploadParam, UploadResponse, GetSignedUrlOperation, GetSignedUrlParam
} from '../../cloud-storage-service';

import path from 'path';
import fs from 'fs';

export default class CloudStorageServiceImpl extends CloudStorageService {
  private _rootPath;

  constructor(config: Config & any) {
    super();
    this._rootPath = path.resolve(config.path);
  }

  _getDirPath(bucketName: string, objectName: string | null) {
    let objectNameToken = objectName ? objectName.split('/') : null;
    let dir = path.join(this._rootPath, bucketName, 'data');
    if (objectNameToken) {
      for (let i=1; i < objectNameToken.length; i++) {
        dir = path.join(dir, objectNameToken[i - 1]);
      }
    }
    return path.resolve(dir);
  }

  _autoMkdir(dir: string): Promise<void> {
    return fs.promises.mkdir(dir, {
      recursive: true
    });
  }

  createBucket(param: BucketParam): Promise<CreateBucketResponse> {
    return this._autoMkdir(this._getDirPath(param.bucketName, null))
      .then(() => ({} as CreateBucketResponse));
  }

  deleteBucket(param: BucketParam): Promise<DeleteBucketResponse> {
    return new Promise<CreateBucketResponse>((resolve, reject) => {
      fs.rmdir(path.resolve(this._rootPath, param.bucketName), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  listBuckets(param?: BaseParam): Promise<ListBucketsResponse> {
    const paramRawOutput = param ? param.rawOutput : false;
    return new Promise<ListBucketsResponse>((resolve, reject) => {
      fs.readdir(path.resolve(this._rootPath), async (err, files) => {
        if (err) {
          reject(err);
        } else {
          let buckets: Bucket[] = [];
          for (let file of files) {
            let dir = path.resolve(this._rootPath, file);
            let info: fs.Stats = await new Promise((sres, srej) => {
              fs.lstat(dir, (err, info) => {
                if (err) {
                  srej(err);
                } else {
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
      });
    });
  }

  putObject(param: PutObjectParam): Promise<PutObjectResponse> {
    return this._autoMkdir(this._getDirPath(param.bucketName, null))
      .then(() => new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(this._rootPath, param.bucketName + '/data/' + param.key), param.body, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }));
  }

  upload(param: PutObjectParam): Promise<PutObjectResponse> {
    return this._autoMkdir(this._getDirPath(param.bucketName, null))
      .then(() => new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(this._rootPath, param.bucketName + '/data/' + param.key), param.body, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({} as PutObjectResponse);
          }
        });
      }));
  }

  getSignedUrl(operation: GetSignedUrlOperation, param: GetSignedUrlParam): Promise<string> {
    return Promise.reject(Error('Not support yet'));
  }

  getNative() {
    return null;
  }

  getObjectRealPath(bucketName: string, objectName: string): string {
    return path.resolve(this._rootPath, bucketName + '/data/' + objectName);
  }

  getObjectRealPathWithPutPrepare(bucketName: string, objectName: string): Promise<string> {
    return this._autoMkdir(this._getDirPath(bucketName, objectName))
      .then(() => path.resolve(this._rootPath, bucketName + '/data/' + objectName));
  }
}
