import {ServerModule} from '../server-module';
import {JsExpressServer} from '../server';
import {Request, Response} from 'express';

import * as path from 'path'
import * as fs from 'fs'

let INSTANCE: MessageResolverImpl;

export interface MessageResolverOptions {
    localePath?: string;
    resolveCallback?: (locale: string, messageId: string, params?: any[]) => string;
}

export class MessageResolverImpl extends ServerModule {
    private _options: MessageResolverOptions;

    private _cachedMessages: Map<string, any> = new Map();

    private _sessionLocale: string = 'ko';

    constructor(options: MessageResolverOptions) {
        super();
        this._options = options;
    }

    attachTo(server: JsExpressServer): void {
        INSTANCE = this;
    }

    httpRequestStart(req: Request, res: Response): boolean {
        let appLocale: string | undefined = req.header('x-app-locale');
        if(appLocale) {
            this._sessionLocale = appLocale;
        }else{
            this._sessionLocale = 'ko';
        }
        console.log('Message Resolver: ', this._sessionLocale);
        return false;
    }

    _makeMessagePack(pack: any, json: object, prefixKey?: string) {
        Object.keys(json).forEach((key, index, array) => {
            const messageId = (prefixKey ? prefixKey + '.' : '') + key;
            let item = json[key];
            if(typeof item === 'string') {
                pack[messageId] = item;
            }else{
                this._makeMessagePack(pack, item, messageId);
            }
        });
    }

    resolve(messageId: string, params?: any[]): string | null {
        const cacheId = this._sessionLocale + ':' + messageId;
        let localedMessage;
        if(this._cachedMessages.has(cacheId)) {
            localedMessage = this._cachedMessages.get(cacheId);
        }else{
            if(this._options.localePath) {
                let filePath = path.resolve(this._options.localePath, this._sessionLocale + '.json');
                if (fs.existsSync(filePath)) {
                    let rawData = fs.readFileSync(filePath);
                    let json = JSON.parse(rawData.toString('utf-8'));
                    let pack = {};
                    this._makeMessagePack(pack, json);
                    Object.keys(pack).forEach((value, index, array) => {
                        this._cachedMessages.set(this._sessionLocale + ':' + value, pack[value]);
                    });
                    localedMessage = pack[messageId];
                }
            }
            if(!localedMessage && this._options.resolveCallback) {
                localedMessage = this._options.resolveCallback(this._sessionLocale, messageId, params);
            }
        }
        return localedMessage;
    }
}

export function messageResolver(options: string | MessageResolverOptions): MessageResolverImpl {
    const wrappedOptions: MessageResolverOptions = (typeof options === 'string') ? {localePath: options} : options;
    return new MessageResolverImpl(wrappedOptions);
}

export function resolve(messageId: string, params?: any[]) {
    if(!INSTANCE) {
        throw new Error('message-resovler is not active.');
    }
    return INSTANCE.resolve(messageId, params);
}

