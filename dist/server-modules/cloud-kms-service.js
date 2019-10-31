"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_module_1 = require("../server-module");
let INSTANCE;
class CloudKmsService extends server_module_1.ServerModule {
    attachTo(server) {
        INSTANCE = this;
    }
}
exports.CloudKmsService = CloudKmsService;
function generateDataKey(param) {
    return INSTANCE.generateDataKey(param);
}
exports.generateDataKey = generateDataKey;
function encrypt(param) {
    return INSTANCE.encrypt(param);
}
exports.encrypt = encrypt;
function decrypt(param) {
    return INSTANCE.decrypt(param);
}
exports.decrypt = decrypt;
