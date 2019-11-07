import express, {Router, Express, Request, Response} from 'express';
import {ApplicationRequestHandler, Application} from 'express-serve-static-core'
import http, {Server} from 'http';
import * as ClsHooked from 'cls-hooked'

import {ServerModule} from './server-module';

const C_ROUTE_HANDLER: symbol = Symbol('_ROUTE_HANDLER');
const C_IS_LAMBDA: symbol = Symbol('IS_LAMBDA');
const C_AWS_SERVERLESS_EXPRESS: symbol = Symbol('AWS_SERVERLESS_EXPRESS');
const C_EXPRESS_APP: symbol = Symbol('EXPRESS_APP');
const C_EXPRESS_SERVER: symbol = Symbol('EXPRESS_SERVER');
const C_SERVER: symbol = Symbol('SERVER');
const C_SETTINGS: symbol = Symbol('SETTINGS');
const C_SERVER_MODULES: symbol = Symbol('SERVER_MODULES');
const C_ERROR_HANDLER: symbol = Symbol('ERROR_HANDLER');
const C_CALL_ERROR_HANDLER: symbol = Symbol('CALL_ERROR_HANDLER');

const requestSessionNs = ClsHooked.createNamespace('js-express-request-session');

export type ErrorType = 'request';
export type ErrorHandlerType = (type: ErrorType, err) => void;

export class RequestSession {
    static get(key: string): any {
        return requestSessionNs.get(key);
    }
    static set<T>(key: string, value: T) {
        return requestSessionNs.set(key, value);
    }
}

export interface Route {
    path: string;
    method: string;
    handler: (req: Request, res: Response) => void;

    consumes?: string | string[];
}

export interface Settings {
    apiOriginPath: string;
    port: number;
    host?: string;
    backlog: number;
}

function i<T>(p: JsExpressServer, s: symbol): T {
    return p[s] as T;
}

function s<T>(p: JsExpressServer, s: symbol, value: T) {
    p[s] = value;
}

export class JsExpressServer {
    // private [C_IS_LAMBDA]: boolean;
    // private [C_AWS_SERVERLESS_EXPRESS]: any;

    // private [C_EXPRESS_APP]: Express
    // private [C_SERVER]: Server
    // private [EXPRESS_SERVER]:

    // private [C_SETTINGS]: Settings

    // private [C_SERVER_MODULES]: ServerModule[]

    // private [C_ERROR_HANDLER]: ErrorHandlerType | null;

    constructor(settings: Settings) {
        const inLambda = !!process.env.LAMBDA_TASK_ROOT;
        const awsServerlessExpress: any = require('aws-serverless-express');
        const expressApp: Express = express();
        let server: Server;
        const serverModules: ServerModule[] = [];

        if (inLambda) {
            server = awsServerlessExpress.createServer(expressApp);
        } else {
            server = http.createServer(expressApp);
        }

        expressApp.use(express.json());
        expressApp.use((req: Request, res: Response, next) => {
            requestSessionNs.run(() => {
                next();
            });
        });
        expressApp.use((req: Request, res: Response, next) => {
            // Interceptor

            let handled: boolean = false;
            for(let mod of i<ServerModule[]>(this, C_SERVER_MODULES)) {
                handled = mod.httpRequestStart(req, res);
                if(handled)
                    return ;
            }

            next();
        });

        Object.defineProperties(this, {
            [C_IS_LAMBDA]: {value: inLambda},
            [C_AWS_SERVERLESS_EXPRESS]: {value: awsServerlessExpress},
            [C_EXPRESS_APP]: {value: expressApp},
            [C_SERVER]: {value: server},
            [C_SETTINGS]: {value: settings},
            [C_SERVER_MODULES]: {value: serverModules}
        });
    }

    close() {
        if(!this[C_IS_LAMBDA]) {
            i<http.Server>(this, C_EXPRESS_SERVER).close();
        }
    }

    get isInLambda(): boolean {
        return this[C_IS_LAMBDA];
    }

    get lambdaHandler(): any {
        return (event, context) => i<any>(this, C_AWS_SERVERLESS_EXPRESS).proxy(i<Express>(this, C_SERVER), event, context);
    }

    get onerror(): ErrorHandlerType | null {
        return i<ErrorHandlerType | null>(this, C_ERROR_HANDLER);
    }

    set onerror(handler: ErrorHandlerType | null) {
        s<ErrorHandlerType | null>(this, C_ERROR_HANDLER, handler);
    }

    [C_CALL_ERROR_HANDLER](type: ErrorType, err) {
        const handler: ErrorHandlerType | null = this.onerror;
        if(handler) {
            handler(type, err);
        }
    }

    use(module: ServerModule | any): any {
        if(typeof module['getRootInstanceType'] == 'function') {
            if(module['getRootInstanceType']() == ServerModule.ROOT_INSTANCE_TYPE) {
                const serverModule: ServerModule = module as ServerModule;
                serverModule.attachTo(this);
                i<ServerModule[]>(this, C_SERVER_MODULES).push(serverModule);
                return ;
            }
        }

        return i<Express>(this, C_EXPRESS_APP).use(module);
    }

    start() {
        i<Express>(this, C_EXPRESS_APP).use((req: Request, res: Response, next) => {
            res.status(404);
            res.send({
                message: 'error.http.not_found',
                messageLocaled: 'NOT FOUND'
            });
        });

        if (!i<boolean>(this, C_IS_LAMBDA)) {
            const settings: Settings = i<Settings>(this, C_SETTINGS);
            if(settings.host) {
                s<http.Server>(this, C_EXPRESS_SERVER, i<Express>(this, C_EXPRESS_APP).listen(settings.port, settings.host, settings.backlog));
            }else{
                s<http.Server>(this, C_EXPRESS_SERVER, i<Express>(this, C_EXPRESS_APP).listen(settings.port));
            }
        }
    }

    [C_ROUTE_HANDLER](route: Route, req: Request, res: Response) {
        if(route.consumes) {
            const meta = (req.headers['content-type'] || '').split(';');
            const mime = meta[0].trim().toLowerCase();
            let accept: boolean = false;
            if(Array.isArray(route.consumes)) {
                for(let item of route.consumes) {
                    if(mime == item.toLowerCase()) {
                        accept = true;
                        break;
                    }
                }
            }else if(mime == route.consumes) {
                accept = true;
            }
            if(!accept) {
                res.sendStatus(415);
                return ;
            }
        }

        const errorHandler = (err) => {
            res.status(500).send({message: 'Server Error'});
            this[C_CALL_ERROR_HANDLER]('request', err);
        };

        try {
            let funcRet;
            const isAsync = route.handler.constructor.name === "AsyncFunction";
            if(typeof route.handler == 'object') {
                funcRet = (route.handler as any)['default'](req, res);
            }else{
                funcRet = route.handler(req, res);
            }
            if(funcRet) {
                const isPromise = typeof funcRet.then == 'function';
                if(isAsync || isPromise) {
                    Promise.resolve(funcRet)
                        .catch(errorHandler);
                }
            }
        }catch(err){
            errorHandler(err);
        }
    }

    applyRoutes(routes: Route[]) {
        const settings: Settings = i<Settings>(this, C_SETTINGS);
        for(const item of routes) {
            (i<Express>(this, C_EXPRESS_APP))[item.method](settings.apiOriginPath + item.path, this[C_ROUTE_HANDLER].bind(this, item));
        }
    }
}

export function defaultSettings(): Settings {
    const s: Settings = {
        apiOriginPath: '/',
        port: 8080,
        backlog: 64
    };
    if(process.env.PORT) {
        s.port = Number.parseInt(process.env.PORT);
    }
    if(process.env.HOST) {
        s.host = process.env.HOST;
    }
    return s;
}

export function createServer(settings: Settings): JsExpressServer {
    return new JsExpressServer(settings);
}
