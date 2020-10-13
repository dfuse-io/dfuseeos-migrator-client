/// <reference types="node" />
import { Account, AccountInfo, Row, TableScope } from "./types";
export declare function getAccountName(accountJsonPath: string): string;
export declare function isAccount(fileName: string): boolean;
export declare function isTableScope(fileName: string): boolean;
export declare function getABI(accountJsonPath: string): (Buffer | undefined);
export declare function getWasm(accountJsonPath: string): (Buffer | undefined);
export declare function getAccountInfo(accountJsonPath: string): (AccountInfo);
export declare function explodeRowsPath(rowsPath: string): {
    tableName: string;
    scope: string;
};
export declare function getRows(rowsJsonPath: string): Row[];
export declare function writeAccount(basePath: string, account: Account): void;
export declare function writeAccountInfo(accountPath: string, account: Account): void;
export declare function writeABI(accountPath: string, account: Account): void;
export declare function writeWasm(accountPath: string, account: Account): void;
export declare function writeTableScope(basePath: string, tblScope: TableScope): void;
export declare function isDir(dirPath: string): boolean;
export declare function getFilename(dirPath: string): string;
export declare function getAccountPath(dirPath: string): string;
export declare function fileExists(filepath: string): boolean;
export declare function cleanDir(dirPath: string): void;
