import * as mysql from 'mysql'
import {FieldInfo, MysqlError} from 'mysql';
import {PoolConnection} from 'mysql';
import {ServerModule} from '../server-module';
import {JsExpressServer} from '../server';
import {QueryOptions} from "mysql";

let INSTANCE: RdbServiceImpl;

export interface QueryResult {
    results?: any;
    fields?: FieldInfo[];
}

export class PromissConnection {
    private _conn: PoolConnection;

    constructor(conn: PoolConnection) {
        this._conn = conn;
    }

    getNativeConnection(): PoolConnection {
        return this._conn;
    }

    beginTransaction(options?: QueryOptions): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._conn.beginTransaction(options, err => err ? reject(err) : resolve());
        });
    }

    commit(options?: QueryOptions, callback?: (err: MysqlError) => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._conn.commit(options, err => err ? reject(err) : resolve());
        });
    }
    rollback(options?: QueryOptions, callback?: (err: MysqlError) => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._conn.rollback(options, err => err ? reject(err) : resolve());
        });
    }

    query(options: string | QueryOptions, values?: any): Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            const callback = (err, results, fields) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve({
                    results: results,
                    fields: fields
                });
            };
            if(typeof options === 'string') {
                this._conn.query(options, values, callback);
            }else{
                this._conn.query(options, callback);
            }
        });
    }
}

export class RdbServiceImpl extends ServerModule {
    private _pool?: mysql.Pool;

    constructor(config: mysql.PoolConfig) {
        super();
        this._pool = mysql.createPool(config);
    }

    attachTo(server: JsExpressServer): void {
        INSTANCE = this;
    }

    getConnection(callback: (err: MysqlError, connection: PoolConnection) => void) {
        if(!this._pool)
            return ;
        this._pool.getConnection(callback);
    }

    getConnectionSafe(handler: (connection: PromissConnection) => void | Promise<void>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(!this._pool) {
                reject(Error("Closed pool"));
                return ;
            }
            this._pool.getConnection((err: MysqlError, connection: PoolConnection) => {
                if(err) {
                    reject(err);
                    return;
                }

                let res: any = handler(new PromissConnection(connection));
                let isAsync = handler.constructor.name === 'AsyncFunction';
                let isPromise = res && ((typeof res.then) == 'function');

                let doRelease = () => {
                    const count = (this._pool as any)._freeConnections.indexOf(connection);
                    if(count != 0) {
                        connection.release();
                    }
                };

                if(isAsync || isPromise) {
                    Promise.resolve(res)
                        .then((x) => {
                            doRelease();
                            resolve(x);
                        })
                        .catch((e) => {
                            doRelease();
                            reject(e);
                        });
                }else{
                    doRelease();
                    resolve(res);
                }
            });
        })
    }
}

export function rdbService(config: mysql.PoolConfig): RdbServiceImpl {
    return new RdbServiceImpl(config);
}

export function getConnectionSafe(handler: (connection: PromissConnection) => void | Promise<void>): Promise<void> {
    if (!INSTANCE) {
        throw new Error('rdb-service is not active.');
    }
    return INSTANCE.getConnectionSafe(handler);
}
