import { CloudStorageService, Config, BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse, PutObjectParam, PutObjectResponse, UploadParam, UploadResponse } from '../../cloud-storage-service';
import { S3 } from 'aws-sdk';
export default class CloudStorageServiceImpl extends CloudStorageService {
    private _native;
    constructor(config: Config & any);
    createBucket(param: BucketParam): Promise<CreateBucketResponse>;
    deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
    listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
    putObject(param: PutObjectParam): Promise<PutObjectResponse>;
    upload(param: UploadParam): Promise<UploadResponse>;
    getNative(): S3;
}
//# sourceMappingURL=cloud-storage-service-impl.d.ts.map