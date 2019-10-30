import * as CloudStorageService from './cloud-storage-service'

import LegacyCloudStorageService from './providers/legacy/cloud-storage-service-impl'

export function cloudStorageService(config: CloudStorageService.Config & any): CloudStorageService.CloudStorageService {
    switch(config.provider) {
        case 'file':
            return new LegacyCloudStorageService(config);
    }
    throw Error("Not support provider");
}
