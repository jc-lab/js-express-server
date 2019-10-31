import * as RdbService from './rdb-service';
import * as MessageResolver from './message-resolver';
import * as mysql from 'mysql';
import * as CloudKmsService from './cloud-kms-service';
import * as CloudStorageService from './cloud-storage-service';
export declare function rdbService(config: mysql.PoolConfig): RdbService.RdbServiceImpl;
export declare function messageResolver(localePath: string): MessageResolver.MessageResolverImpl;
export declare function cloudKmsService(config: CloudKmsService.Config & any): CloudKmsService.CloudKmsService;
export declare function cloudStorageService(config: CloudStorageService.Config & any): CloudStorageService.CloudStorageService;
//# sourceMappingURL=factory.d.ts.map