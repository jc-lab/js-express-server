import { JsExpressServer } from "./server";
import { Request, Response } from "express";
export declare class ServerModule {
    static ROOT_INSTANCE_TYPE: string;
    getRootInstanceType(): string;
    attachTo(server: JsExpressServer): void;
    httpRequestStart(req: Request, res: Response): boolean;
    httpRequestEnd(req: Request, res: Response): void;
}
//# sourceMappingURL=server-module.d.ts.map