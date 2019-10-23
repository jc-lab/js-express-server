import * as RdbService from './server-modules/rdb-service'
import * as MessageResolver from './server-modules/message-resolver'
import * as CloudKmsService from './server-modules/cloud-kms-service'

import * as mysql from 'mysql'

export * from './server'
export * from './server-module'

export function rdbService(config: mysql.PoolConfig) {
    return RdbService.rdbService(config);
}

export function messageResolver(localePath: string) {
    return MessageResolver.messageResolver(localePath);
}

export function cloudKmsService(config: CloudKmsService.Config & any) {
    return CloudKmsService.cloudKmsService(config);
}

export {
    RdbService,
    MessageResolver,
    CloudKmsService
}
