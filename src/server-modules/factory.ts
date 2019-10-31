import * as RdbService from './rdb-service'
import * as MessageResolver from './message-resolver'

import * as mysql from 'mysql'

import * as CloudKmsService from './cloud-kms-service'
import * as CloudStorageService from './cloud-storage-service'

import AWSCloudKmsService from './providers/aws/cloud-kms-service-impl'

import AWSCloudStorageService from './providers/aws/cloud-storage-service-impl'
import LegacyCloudStorageService from './providers/legacy/cloud-storage-service-impl'

export function rdbService(config: mysql.PoolConfig) {
    return RdbService.rdbService(config);
}

export function messageResolver(localePath: string) {
    return MessageResolver.messageResolver(localePath);
}

export function cloudKmsService(config: CloudKmsService.Config & any): CloudKmsService.CloudKmsService {
    switch(config.provider) {
        case 'aws':
            return new AWSCloudKmsService(config);
    }
    throw Error("Not support provider");
}

export function cloudStorageService(config: CloudStorageService.Config & any): CloudStorageService.CloudStorageService {
    switch(config.provider) {
        case 'aws':
            return new AWSCloudStorageService(config);
        case 'file':
            return new LegacyCloudStorageService(config);
    }
    throw Error("Not support provider");
}
