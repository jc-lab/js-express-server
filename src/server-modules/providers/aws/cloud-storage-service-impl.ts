import {
  CloudStorageService,
  Config,
  Bucket,
  BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse,
  PutObjectParam, PutObjectResponse, UploadParam, UploadResponse, GetSignedUrlParam, GetSignedUrlOperation, Acl
} from '../../cloud-storage-service';

import { S3 } from 'aws-sdk';

function convertBucketsFrom(input?: S3.Buckets): Bucket[] {
  const output: Bucket[] = [];
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

function convertOperationFrom(input: GetSignedUrlOperation): string | null {
  switch (input) {
  case 'getObject':
    return 'getObject';
  case 'putObject':
    return 'putObject';
  }
  return null;
}

function convertAcl(input?: Acl): string | undefined {
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

function setParam(out, value, outKey) {
  if (value) {
    out[outKey] = value;
  }
}

export default class CloudStorageServiceImpl extends CloudStorageService {
  private _native: S3;

  constructor(config: Config & any) {
    super();
    this._native = new S3(config as S3.Types.ClientConfiguration);
  }

  createBucket(param: BucketParam): Promise<CreateBucketResponse> {
    return new Promise<CreateBucketResponse>((resolve, reject) => {
      this._native.createBucket(Object.assign({
        Bucket: param.bucketName,
      }, param.etc || {}), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  deleteBucket(param: BucketParam): Promise<DeleteBucketResponse> {
    return new Promise<CreateBucketResponse>((resolve, reject) => {
      this._native.deleteBucket(Object.assign({
        Bucket: param.bucketName
      }, param.etc || {}), (err, data) => {
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
      this._native.listBuckets((err, data) => {
        if (err) {
          reject(err);
        } else {
          const output: ListBucketsResponse = {
            raw: paramRawOutput ? data : undefined,
            buckets: convertBucketsFrom(data.Buckets)
          };
          resolve();
        }
      });
    });
  }

  putObject(param: PutObjectParam): Promise<PutObjectResponse> {
    return new Promise<CreateBucketResponse>((resolve, reject) => {
      this._native.putObject(Object.assign({
        Key: param.key,
        Body: param.body
      }, param.etc) as S3.Types.PutObjectRequest, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  upload(param: UploadParam): Promise<UploadResponse> {
    return new Promise<CreateBucketResponse>((resolve, reject) => {
      this._native.upload(Object.assign({
        Key: param.key,
        Body: param.body
      }, param.etc) as S3.Types.PutObjectRequest, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  getSignedUrl(operation: GetSignedUrlOperation, param: GetSignedUrlParam): Promise<string> {
    const apiParams = {
      Bucket: param.bucketName,
      Key: param.key
    };

    switch (operation) {
    case 'putObject':
      setParam(apiParams, param.contentMd5,'ContentMD5');
      setParam(apiParams, param.contentType,'ContentType');
      setParam(apiParams, param.contentDisposition,'ContentDisposition');
      setParam(apiParams, param.contentEncoding,'ContentEncoding');
      break;
    }
    Object.assign(apiParams, param.etc);
    return this._native.getSignedUrlPromise(convertOperationFrom(operation) as string, apiParams);
  }

  getNative() {
    return this._native;
  }
}
