/// <reference types="node" />
import { ServerModule } from '../server-module';
import { JsExpressServer } from '../server';
import { Readable } from 'stream';
export interface Config {
    provider: 'aws' | 'gcp' | 'file';
    region?: string;
}
export declare type CreationDate = Date;
export declare type Body = Buffer | Uint8Array | Blob | string | Readable;
export declare type GetSignedUrlOperation = 'getObject' | 'putObject';
export declare type Acl = 'private' | 'public-read' | 'public-read-write' | 'authenticated-read' | 'bucket-owner-read' | 'bucket-owner-full-control';
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
export declare abstract class CloudStorageService extends ServerModule {
    attachTo(server: JsExpressServer): void;
    abstract createBucket(param: BucketParam): Promise<CreateBucketResponse>;
    abstract deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
    abstract listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
    abstract putObject(param: PutObjectParam): Promise<PutObjectResponse>;
    abstract upload(param: UploadParam): Promise<UploadResponse>;
    abstract getSignedUrl(operation: GetSignedUrlOperation, params: GetSignedUrlParam): Promise<string>;
    abstract getNative(): any;
}
export declare function createBucket(param: BucketParam): Promise<CreateBucketResponse>;
export declare function deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
export declare function listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
export declare function putObject(param: PutObjectParam): Promise<PutObjectResponse>;
export declare function upload(param: UploadParam): Promise<UploadResponse>;
export declare function getSignedUrl(operation: GetSignedUrlOperation, params: GetSignedUrlParam): Promise<string>;
export declare function getNative(): any;
export declare function getObjectRealPath(bucketName: string, objectName: string): string;
export declare function getObjectRealPathWithPutPrepare(bucketName: string, objectName: string): Promise<string>;
//# sourceMappingURL=cloud-storage-service.d.ts.map