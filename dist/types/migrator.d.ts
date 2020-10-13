/// <reference types="node" />
import { Account, Limits, Element, Row, TableScope, AccountInfo } from "./types";
export declare type OnTableScope = (table: TableScope) => (TableScope | undefined);
interface walkSpec {
    onAccount: (account: Account) => (Account | undefined);
    onTable: OnTableScope;
}
export declare class Migrator {
    inDataPath: string;
    outDataPath: string;
    deletedAccount: string[];
    constructor(inputData: string, outputData: string);
    AddAccount(name: string, spec?: {
        abi?: string | Buffer;
        wasm?: string | Buffer;
        info?: AccountInfo;
        limits?: Limits;
    }): void;
    AddTable(contract: string, name: string, scope: string, rows: Row[]): void;
    Migrate(onElement: (element: Element) => Element | undefined): void;
    walkElements(dir: string, handlers: walkSpec): Promise<void>;
    newAccount(dirPath: string): Account;
    processAccount(accountPath: string, account: Account, onTableScopeHandler: OnTableScope): false | undefined;
    newTableScope(account: Account, rowsPath: string): TableScope;
}
export {};
