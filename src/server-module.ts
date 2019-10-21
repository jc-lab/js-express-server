import {JsExpressServer} from "./server";
import {Request, Response} from "express";

export class ServerModule {
    static ROOT_INSTANCE_TYPE: string = 'js-express-server:ServerModule';

    get getRootInstanceType() {
        return 'js-express-server:ServerModule'
    }

    attachTo(server: JsExpressServer): void {

    }

    httpRequestStart(req: Request, res: Response): boolean {
        return false;
    }

    httpRequestEnd(req: Request, res: Response): void {
    }
}
