import {ServerModule} from '../server-module';
import {JsExpressServer} from '../server';
import {Readable} from 'stream';
import path from 'path';

let INSTANCE: CloudStorageService;

export interface Config {
  provider: 'aws' | 'gcp' | 'file';
  region?: string;
}

export type CreationDate = Date;

export type Body = Buffer|Uint8Array|Blob|string|Readable;

export type GetSignedUrlOperation = 'getObject' | 'putObject';

export type Acl = 'private' | 'public-read' | 'public-read-write' | 'authenticated-read' | 'bucket-owner-read' | 'bucket-owner-full-control';

export interface Bucket {
  /**
     * The name of the bucket.
     */
  name?: string;
  /**
     * Date the bucket was created.
     */
  creationDate?: CreationDate;
}

export interface BaseParam {
  rawOutput?: boolean;
  etc?: object;
}

export interface BucketParam extends BaseParam {
  bucketName: string;
}

export interface PutObjectParam extends BucketParam {
  key: string;
  body?: Body;
}

export interface UploadParam extends BucketParam {
  key: string;
  body?: Body;
}

export interface CreateBucketResponse {

}

export interface DeleteBucketResponse {

}

export interface ListBucketsResponse {
  raw?: object;
  buckets: Bucket[];
}

export interface PutObjectResponse {

}

export interface UploadResponse {

}

export interface GetSignedUrlParam extends BucketParam {
  key: string;
  contentMd5?: string;
  contentType?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  contentLanguage?: string;
}

export abstract class CloudStorageService extends ServerModule {
  attachTo(server: JsExpressServer): void {
    INSTANCE = this;
  }

  abstract createBucket(param: BucketParam): Promise<CreateBucketResponse>;
  abstract deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
  abstract listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
  abstract putObject(param: PutObjectParam): Promise<PutObjectResponse>;
  abstract upload(param: UploadParam): Promise<UploadResponse>;

  abstract getSignedUrl(operation: GetSignedUrlOperation, params: GetSignedUrlParam): Promise<string>;

  abstract getNative();
}

export function createBucket(param: BucketParam): Promise<CreateBucketResponse> {
  return INSTANCE.createBucket(param);
}

export function deleteBucket(param: BucketParam): Promise<DeleteBucketResponse> {
  return INSTANCE.deleteBucket(param);
}

export function listBuckets(param?: BaseParam): Promise<ListBucketsResponse> {
  return INSTANCE.listBuckets(param);
}

export function putObject(param: PutObjectParam): Promise<PutObjectResponse> {
  return INSTANCE.putObject(param);
}

export function upload(param: UploadParam): Promise<UploadResponse> {
  return INSTANCE.upload(param);
}

export function getSignedUrl(operation: GetSignedUrlOperation, params: GetSignedUrlParam): Promise<string> {
  return INSTANCE.getSignedUrl(operation, params);
}

export function getNative(): any {
  return INSTANCE.getNative();
}

export function getObjectRealPath(bucketName: string, objectName: string): string {
  return (INSTANCE as any).getObjectRealPath(bucketName, objectName);
}

export function getObjectRealPathWithPutPrepare(bucketName: string, objectName: string): Promise<string> {
  return (INSTANCE as any).getObjectRealPathWithPutPrepare(bucketName, objectName);
}
