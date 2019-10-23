import * as RdbService from './server-modules/rdb-service';
import * as MessageResolver from './server-modules/message-resolver';
import * as CloudKmsService from './server-modules/cloud-kms-service';
import * as mysql from 'mysql';
export * from './server';
export * from './server-module';
export declare function rdbService(config: mysql.PoolConfig): RdbService.RdbServiceImpl;
export declare function messageResolver(localePath: string): MessageResolver.MessageResolverImpl;
export declare function cloudKmsService(config: CloudKmsService.Config & any): CloudKmsService.CloudKmsService;
export { RdbService, MessageResolver, CloudKmsService };
//# sourceMappingURL=index.d.ts.map