import { CloudStorageService, Config, BucketParam, CreateBucketResponse, BaseParam, DeleteBucketResponse, ListBucketsResponse, PutObjectParam, PutObjectResponse } from '../../cloud-storage-service';
export default class CloudStorageServiceImpl extends CloudStorageService {
    private _rootPath;
    constructor(config: Config & any);
    _getDirPath(bucketName: string, objectName: string | null): string;
    _autoMkdir(dir: string): Promise<void>;
    createBucket(param: BucketParam): Promise<CreateBucketResponse>;
    deleteBucket(param: BucketParam): Promise<DeleteBucketResponse>;
    listBuckets(param?: BaseParam): Promise<ListBucketsResponse>;
    putObject(param: PutObjectParam): Promise<PutObjectResponse>;
    upload(param: PutObjectParam): Promise<PutObjectResponse>;
    getNative(): null;
    getObjectRealPath(bucketName: string, objectName: string): string;
    getObjectRealPathWithPutPrepare(bucketName: string, objectName: string): Promise<string>;
}
//# sourceMappingURL=cloud-storage-service-impl.d.ts.map