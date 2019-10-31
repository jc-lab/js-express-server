"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RdbService = __importStar(require("./rdb-service"));
const MessageResolver = __importStar(require("./message-resolver"));
const cloud_kms_service_impl_1 = __importDefault(require("./providers/aws/cloud-kms-service-impl"));
const cloud_storage_service_impl_1 = __importDefault(require("./providers/aws/cloud-storage-service-impl"));
const cloud_storage_service_impl_2 = __importDefault(require("./providers/legacy/cloud-storage-service-impl"));
function rdbService(config) {
    return RdbService.rdbService(config);
}
exports.rdbService = rdbService;
function messageResolver(localePath) {
    return MessageResolver.messageResolver(localePath);
}
exports.messageResolver = messageResolver;
function cloudKmsService(config) {
    switch (config.provider) {
        case 'aws':
            return new cloud_kms_service_impl_1.default(config);
    }
    throw Error("Not support provider");
}
exports.cloudKmsService = cloudKmsService;
function cloudStorageService(config) {
    switch (config.provider) {
        case 'aws':
            return new cloud_storage_service_impl_1.default(config);
        case 'file':
            return new cloud_storage_service_impl_2.default(config);
    }
    throw Error("Not support provider");
}
exports.cloudStorageService = cloudStorageService;
