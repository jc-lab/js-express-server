import { Request, Response } from 'express';
import * as ClsHooked from 'cls-hooked';
import { ServerModule } from './server-module';
export declare const session: ClsHooked.Namespace;
export declare type ErrorType = 'request';
export declare type ErrorHandlerType = (type: ErrorType, err: any) => void;
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
export declare class JsExpressServer {
    constructor(settings: Settings);
    close(): void;
    readonly isInLambda: boolean;
    readonly lambdaHandler: any;
    onerror: ErrorHandlerType | null;
    use(module: ServerModule | any): any;
    start(): void;
    applyRoutes(routes: Route[]): void;
}
export declare function defaultSettings(): Settings;
export declare function createServer(settings: Settings): JsExpressServer;
//# sourceMappingURL=server.d.ts.map