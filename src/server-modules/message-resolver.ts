import {ServerModule} from '../server-module';
import {JsExpressServer, RequestSession} from '../server';
import {Request, Response} from 'express';

import * as path from 'path';
import * as fs from 'fs';

let INSTANCE: MessageResolverImpl;

export interface MessageResolverOptions {
  defaultLocale?: string;
  localePath?: string;
  resolveCallback?: (locale: string, messageId: string, params?: any[]) => string;
}

export class MessageResolverImpl extends ServerModule {
  private _options: MessageResolverOptions;

  private _cachedMessages: Map<string, any> = new Map();

  constructor(options: MessageResolverOptions) {
    super();
    this._options = options;
  }

  attachTo(server: JsExpressServer): void {
    INSTANCE = this;
  }

  httpRequestStart(req: Request, res: Response): boolean {
    let appLocale: string | undefined = req.header('x-app-locale');
    if (!appLocale) {
      appLocale = this._options.defaultLocale;
    }
    RequestSession.set('_system.message-resolver.locale', appLocale);
    return false;
  }

  _makeMessagePack(pack: any, json: object, prefixKey?: string) {
    Object.keys(json).forEach((key, index, array) => {
      const messageId = (prefixKey ? prefixKey + '.' : '') + key;
      let item = json[key];
      if (typeof item === 'string') {
        pack[messageId] = item;
      } else {
        this._makeMessagePack(pack, item, messageId);
      }
    });
  }

  resolve(messageId: string, params?: any[]): string | null {
    const sessionLocale = RequestSession.get('_system.message-resolver.locale');
    const cacheId = sessionLocale + ':' + messageId;
    let localedMessage;
    if (this._cachedMessages.has(cacheId)) {
      localedMessage = this._cachedMessages.get(cacheId);
    } else {
      if (this._options.localePath) {
        let filePath = path.resolve(this._options.localePath, sessionLocale + '.json');
        if (fs.existsSync(filePath)) {
          let rawData = fs.readFileSync(filePath);
          let json = JSON.parse(rawData.toString('utf-8'));
          let pack = {};
          this._makeMessagePack(pack, json);
          Object.keys(pack).forEach((value, index, array) => {
            this._cachedMessages.set(sessionLocale + ':' + value, pack[value]);
          });
          localedMessage = pack[messageId];
        }
      }
      if (!localedMessage && this._options.resolveCallback) {
        localedMessage = this._options.resolveCallback(sessionLocale, messageId, params);
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
  if (!INSTANCE) {
    throw new Error('message-resovler is not active.');
  }
  return INSTANCE.resolve(messageId, params);
}

