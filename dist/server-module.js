"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerModule {
    getRootInstanceType() {
        return 'js-express-server:ServerModule';
    }
    attachTo(server) {
    }
    httpRequestStart(req, res) {
        return false;
    }
    httpRequestEnd(req, res) {
    }
}
exports.ServerModule = ServerModule;
ServerModule.ROOT_INSTANCE_TYPE = 'js-express-server:ServerModule';
