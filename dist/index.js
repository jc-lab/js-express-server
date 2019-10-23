"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const RdbService = __importStar(require("./server-modules/rdb-service"));
exports.RdbService = RdbService;
const MessageResolver = __importStar(require("./server-modules/message-resolver"));
exports.MessageResolver = MessageResolver;
const CloudKmsService = __importStar(require("./server-modules/cloud-kms-service"));
exports.CloudKmsService = CloudKmsService;
__export(require("./server"));
__export(require("./server-module"));
function rdbService(config) {
    return RdbService.rdbService(config);
}
exports.rdbService = rdbService;
function messageResolver(localePath) {
    return MessageResolver.messageResolver(localePath);
}
exports.messageResolver = messageResolver;
function cloudKmsService(config) {
    return CloudKmsService.cloudKmsService(config);
}
exports.cloudKmsService = cloudKmsService;
