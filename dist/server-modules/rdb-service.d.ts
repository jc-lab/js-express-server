import * as mysql from 'mysql';
import { FieldInfo, MysqlError } from 'mysql';
import { PoolConnection } from 'mysql';
import { ServerModule } from '../server-module';
import { JsExpressServer } from '../server';
import { QueryOptions } from "mysql";
export interface QueryResult {
    results?: any;
    fields?: FieldInfo[];
}
export declare class PromissConnection {
    private _conn;
    constructor(conn: PoolConnection);
    getNativeConnection(): PoolConnection;
    beginTransaction(options?: QueryOptions): Promise<void>;
    commit(options?: QueryOptions, callback?: (err: MysqlError) => void): Promise<void>;
    rollback(options?: QueryOptions, callback?: (err: MysqlError) => void): Promise<void>;
    query(options: string | QueryOptions, values?: any): Promise<QueryResult>;
}
export declare class RdbServiceImpl extends ServerModule {
    private _pool?;
    constructor(config: mysql.PoolConfig);
    attachTo(server: JsExpressServer): void;
    getConnection(callback: (err: MysqlError, connection: PoolConnection) => void): void;
    getConnectionSafe(handler: (connection: PromissConnection) => void | Promise<void>): Promise<void>;
}
export declare function rdbService(config: mysql.PoolConfig): RdbServiceImpl;
export declare function getConnectionSafe(handler: (connection: PromissConnection) => void | Promise<void>): Promise<void>;
//# sourceMappingURL=rdb-service.d.ts.map