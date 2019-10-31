import { CloudStorageService, Config, BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse, PutObjectParam, PutObjectResponse } from '../../cloud-storage-service';
export default class CloudStorageServiceImpl extends CloudStorageService {
    private _rootPath;
    constructor(config: Config & any);
    createBucket(param: BucketParam): Promise<CreateBucketResponse>;
    deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
    listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
    putObject(param: PutObjectParam): Promise<PutObjectResponse>;
    upload(param: PutObjectParam): Promise<PutObjectResponse>;
    getNative(): null;
}
//# sourceMappingURL=cloud-storage-service-impl.d.ts.map