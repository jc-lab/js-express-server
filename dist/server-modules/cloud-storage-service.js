"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_module_1 = require("../server-module");
let INSTANCE;
class CloudStorageService extends server_module_1.ServerModule {
    attachTo(server) {
        INSTANCE = this;
    }
}
exports.CloudStorageService = CloudStorageService;
function createBucket(param) {
    return INSTANCE.createBucket(param);
}
exports.createBucket = createBucket;
function deleteBucket(param) {
    return INSTANCE.deleteBucket(param);
}
exports.deleteBucket = deleteBucket;
function listBuckets(param) {
    return INSTANCE.listBuckets(param);
}
exports.listBuckets = listBuckets;
function putObject(param) {
    return INSTANCE.putObject(param);
}
exports.putObject = putObject;
function upload(param) {
    return INSTANCE.upload(param);
}
exports.upload = upload;
function getSignedUrl(operation, params) {
    return INSTANCE.getSignedUrl(operation, params);
}
exports.getSignedUrl = getSignedUrl;
function getNative() {
    return INSTANCE.getNative();
}
exports.getNative = getNative;
function getObjectRealPath(bucketName, objectName) {
    return INSTANCE.getObjectRealPath(bucketName, objectName);
}
exports.getObjectRealPath = getObjectRealPath;
function getObjectRealPathWithPutPrepare(bucketName, objectName) {
    return INSTANCE.getObjectRealPathWithPutPrepare(bucketName, objectName);
}
exports.getObjectRealPathWithPutPrepare = getObjectRealPathWithPutPrepare;
