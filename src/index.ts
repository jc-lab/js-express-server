import * as RdbService from './server-modules/rdb-service'
import * as MessageResolver from './server-modules/message-resolver'

import * as mysql from 'mysql'

export * from './server'
export * from './server-module'

export function rdbService(config: mysql.PoolConfig) {
    return RdbService.rdbService(config);
}

export function messageResolver(localePath: string) {
    return MessageResolver.messageResolver(localePath);
}

export {
    RdbService,
    MessageResolver
}
