"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
const server_module_1 = require("../server-module");
let INSTANCE;
class PromissConnection {
    constructor(conn) {
        this._conn = conn;
    }
    getNativeConnection() {
        return this._conn;
    }
    beginTransaction(options) {
        return new Promise((resolve, reject) => {
            this._conn.beginTransaction(options, err => err ? reject(err) : resolve());
        });
    }
    commit(options, callback) {
        return new Promise((resolve, reject) => {
            this._conn.commit(options, err => err ? reject(err) : resolve());
        });
    }
    rollback(options, callback) {
        return new Promise((resolve, reject) => {
            this._conn.rollback(options, err => err ? reject(err) : resolve());
        });
    }
    query(options, values) {
        return new Promise((resolve, reject) => {
            const callback = (err, results, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    results: results,
                    fields: fields
                });
            };
            if (typeof options === 'string') {
                this._conn.query(options, values, callback);
            }
            else {
                this._conn.query(options, callback);
            }
        });
    }
}
exports.PromissConnection = PromissConnection;
class RdbServiceImpl extends server_module_1.ServerModule {
    constructor(config) {
        super();
        this._pool = mysql.createPool(config);
    }
    attachTo(server) {
        INSTANCE = this;
    }
    getConnection(callback) {
        if (!this._pool)
            return;
        this._pool.getConnection(callback);
    }
    getConnectionSafe(handler) {
        return new Promise((resolve, reject) => {
            if (!this._pool) {
                reject(Error("Closed pool"));
                return;
            }
            this._pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                let res = handler(new PromissConnection(connection));
                let isAsync = handler.constructor.name === 'AsyncFunction';
                let isPromise = res && ((typeof res.then) == 'function');
                let doRelease = () => {
                    const count = this._pool._freeConnections.indexOf(connection);
                    if (count != 0) {
                        connection.release();
                    }
                };
                if (isAsync || isPromise) {
                    Promise.resolve(res)
                        .then((x) => {
                        doRelease();
                        resolve(x);
                    })
                        .catch((e) => {
                        doRelease();
                        reject(e);
                    });
                }
                else {
                    doRelease();
                    resolve(res);
                }
            });
        });
    }
}
exports.RdbServiceImpl = RdbServiceImpl;
function rdbService(config) {
    return new RdbServiceImpl(config);
}
exports.rdbService = rdbService;
function getConnectionSafe(handler) {
    if (!INSTANCE) {
        throw new Error('rdb-service is not active.');
    }
    return INSTANCE.getConnectionSafe(handler);
}
exports.getConnectionSafe = getConnectionSafe;
