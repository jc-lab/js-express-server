"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_module_1 = require("../server-module");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let INSTANCE;
class MessageResolverImpl extends server_module_1.ServerModule {
    constructor(options) {
        super();
        this._cachedMessages = new Map();
        this._sessionLocale = 'ko';
        this._options = options;
    }
    attachTo(server) {
        INSTANCE = this;
    }
    httpRequestStart(req, res) {
        let appLocale = req.header('x-app-locale');
        if (appLocale) {
            this._sessionLocale = appLocale;
        }
        else {
            this._sessionLocale = 'ko';
        }
        return false;
    }
    _makeMessagePack(pack, json, prefixKey) {
        Object.keys(json).forEach((key, index, array) => {
            const messageId = (prefixKey ? prefixKey + '.' : '') + key;
            let item = json[key];
            if (typeof item === 'string') {
                pack[messageId] = item;
            }
            else {
                this._makeMessagePack(pack, item, messageId);
            }
        });
    }
    resolve(messageId, params) {
        const cacheId = this._sessionLocale + ':' + messageId;
        let localedMessage;
        if (this._cachedMessages.has(cacheId)) {
            localedMessage = this._cachedMessages.get(cacheId);
        }
        else {
            if (this._options.localePath) {
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
            if (!localedMessage && this._options.resolveCallback) {
                localedMessage = this._options.resolveCallback(this._sessionLocale, messageId, params);
            }
        }
        return localedMessage;
    }
}
exports.MessageResolverImpl = MessageResolverImpl;
function messageResolver(options) {
    const wrappedOptions = (typeof options === 'string') ? { localePath: options } : options;
    return new MessageResolverImpl(wrappedOptions);
}
exports.messageResolver = messageResolver;
function resolve(messageId, params) {
    if (!INSTANCE) {
        throw new Error('message-resovler is not active.');
    }
    return INSTANCE.resolve(messageId, params);
}
exports.resolve = resolve;
