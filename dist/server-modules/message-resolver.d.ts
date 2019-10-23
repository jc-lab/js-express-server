import { ServerModule } from '../server-module';
import { JsExpressServer } from '../server';
import { Request, Response } from 'express';
export interface MessageResolverOptions {
    localePath?: string;
    resolveCallback?: (locale: string, messageId: string, params?: any[]) => string;
}
export declare class MessageResolverImpl extends ServerModule {
    private _options;
    private _cachedMessages;
    private _sessionLocale;
    constructor(options: MessageResolverOptions);
    attachTo(server: JsExpressServer): void;
    httpRequestStart(req: Request, res: Response): boolean;
    _makeMessagePack(pack: any, json: object, prefixKey?: string): void;
    resolve(messageId: string, params?: any[]): string | null;
}
export declare function messageResolver(options: string | MessageResolverOptions): MessageResolverImpl;
export declare function resolve(messageId: string, params?: any[]): string | null;
//# sourceMappingURL=message-resolver.d.ts.map