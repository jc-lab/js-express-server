"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ClsHooked = __importStar(require("cls-hooked"));
const server_module_1 = require("./server-module");
const C_ROUTE_HANDLER = Symbol('_ROUTE_HANDLER');
const C_IS_LAMBDA = Symbol('IS_LAMBDA');
const C_AWS_SERVERLESS_EXPRESS = Symbol('AWS_SERVERLESS_EXPRESS');
const C_EXPRESS_APP = Symbol('EXPRESS_APP');
const C_EXPRESS_SERVER = Symbol('EXPRESS_SERVER');
const C_SERVER = Symbol('SERVER');
const C_SETTINGS = Symbol('SETTINGS');
const C_SERVER_MODULES = Symbol('SERVER_MODULES');
const C_ERROR_HANDLER = Symbol('ERROR_HANDLER');
const C_CALL_ERROR_HANDLER = Symbol('CALL_ERROR_HANDLER');
const requestSessionNs = ClsHooked.createNamespace('js-express-request-session');
class RequestSession {
    static get(key) {
        return requestSessionNs.get(key);
    }
    static set(key, value) {
        return requestSessionNs.set(key, value);
    }
}
exports.RequestSession = RequestSession;
function i(p, s) {
    return p[s];
}
function s(p, s, value) {
    p[s] = value;
}
class JsExpressServer {
    // private [C_IS_LAMBDA]: boolean;
    // private [C_AWS_SERVERLESS_EXPRESS]: any;
    // private [C_EXPRESS_APP]: Express
    // private [C_SERVER]: Server
    // private [EXPRESS_SERVER]:
    // private [C_SETTINGS]: Settings
    // private [C_SERVER_MODULES]: ServerModule[]
    // private [C_ERROR_HANDLER]: ErrorHandlerType | null;
    constructor(settings) {
        const inLambda = !!process.env.LAMBDA_TASK_ROOT;
        const awsServerlessExpress = require('aws-serverless-express');
        const expressApp = express_1.default();
        let server;
        const serverModules = [];
        if (inLambda) {
            server = awsServerlessExpress.createServer(expressApp);
        }
        else {
            server = http_1.default.createServer(expressApp);
        }
        expressApp.use(express_1.default.json());
        expressApp.use((req, res, next) => {
            requestSessionNs.run(() => {
                next();
            });
        });
        expressApp.use((req, res, next) => {
            // Interceptor
            let handled = false;
            for (let mod of i(this, C_SERVER_MODULES)) {
                handled = mod.httpRequestStart(req, res);
                if (handled)
                    return;
            }
            next();
        });
        Object.defineProperties(this, {
            [C_IS_LAMBDA]: { value: inLambda },
            [C_AWS_SERVERLESS_EXPRESS]: { value: awsServerlessExpress },
            [C_EXPRESS_APP]: { value: expressApp },
            [C_SERVER]: { value: server },
            [C_SETTINGS]: { value: settings },
            [C_SERVER_MODULES]: { value: serverModules }
        });
    }
    close() {
        if (!this[C_IS_LAMBDA]) {
            i(this, C_EXPRESS_SERVER).close();
        }
    }
    get isInLambda() {
        return this[C_IS_LAMBDA];
    }
    get lambdaHandler() {
        return (event, context) => i(this, C_AWS_SERVERLESS_EXPRESS).proxy(i(this, C_SERVER), event, context);
    }
    get onerror() {
        return i(this, C_ERROR_HANDLER);
    }
    set onerror(handler) {
        s(this, C_ERROR_HANDLER, handler);
    }
    [C_CALL_ERROR_HANDLER](type, err) {
        const handler = this.onerror;
        if (handler) {
            handler(type, err);
        }
    }
    use(module) {
        if (typeof module['getRootInstanceType'] == 'function') {
            if (module['getRootInstanceType']() == server_module_1.ServerModule.ROOT_INSTANCE_TYPE) {
                const serverModule = module;
                serverModule.attachTo(this);
                i(this, C_SERVER_MODULES).push(serverModule);
                return;
            }
        }
        return i(this, C_EXPRESS_APP).use(module);
    }
    start() {
        i(this, C_EXPRESS_APP).use((req, res, next) => {
            res.status(404);
            res.send({
                message: 'error.http.not_found',
                messageLocaled: 'NOT FOUND'
            });
        });
        if (!i(this, C_IS_LAMBDA)) {
            const settings = i(this, C_SETTINGS);
            if (settings.host) {
                s(this, C_EXPRESS_SERVER, i(this, C_EXPRESS_APP).listen(settings.port, settings.host, settings.backlog));
            }
            else {
                s(this, C_EXPRESS_SERVER, i(this, C_EXPRESS_APP).listen(settings.port));
            }
        }
    }
    [C_ROUTE_HANDLER](route, req, res) {
        if (route.consumes) {
            const meta = (req.headers['content-type'] || '').split(';');
            const mime = meta[0].trim().toLowerCase();
            let accept = false;
            if (Array.isArray(route.consumes)) {
                for (let item of route.consumes) {
                    if (mime == item.toLowerCase()) {
                        accept = true;
                        break;
                    }
                }
            }
            else if (mime == route.consumes) {
                accept = true;
            }
            if (!accept) {
                res.sendStatus(415);
                return;
            }
        }
        const errorHandler = (err) => {
            res.status(500).send({ message: 'Server Error' });
            this[C_CALL_ERROR_HANDLER]('request', err);
        };
        try {
            let funcRet;
            const isAsync = route.handler.constructor.name === "AsyncFunction";
            if (typeof route.handler == 'object') {
                funcRet = route.handler['default'](req, res);
            }
            else {
                funcRet = route.handler(req, res);
            }
            if (funcRet) {
                const isPromise = typeof funcRet.then == 'function';
                if (isAsync || isPromise) {
                    Promise.resolve(funcRet)
                        .catch(errorHandler);
                }
            }
        }
        catch (err) {
            errorHandler(err);
        }
    }
    applyRoutes(routes) {
        const settings = i(this, C_SETTINGS);
        for (const item of routes) {
            (i(this, C_EXPRESS_APP))[item.method](settings.apiOriginPath + item.path, this[C_ROUTE_HANDLER].bind(this, item));
        }
    }
}
exports.JsExpressServer = JsExpressServer;
function defaultSettings() {
    const s = {
        apiOriginPath: '/',
        port: 8080,
        backlog: 64
    };
    if (process.env.PORT) {
        s.port = Number.parseInt(process.env.PORT);
    }
    if (process.env.HOST) {
        s.host = process.env.HOST;
    }
    return s;
}
exports.defaultSettings = defaultSettings;
function createServer(settings) {
    return new JsExpressServer(settings);
}
exports.createServer = createServer;
