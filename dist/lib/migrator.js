"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrator = void 0;
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const logger = require('debug')('dfuse:migrator');
const navigation_1 = require("./navigation");
const walk_1 = require("./walk");
class Migrator {
    constructor(inputData, outputData) {
        this.inDataPath = inputData;
        this.outDataPath = outputData;
        this.deletedAccount = [];
    }
    AddAccount(name, spec = {}) {
        const account = {
            type: "account",
            name: name,
            limits: spec.limits,
            data: {},
            abi: spec.abi,
            wasm: spec.wasm,
        };
        navigation_1.writeAccount(this.outDataPath, account);
    }
    AddTable(contract, name, scope, rows) {
        const tblScope = {
            type: "tableScope",
            contract: contract,
            tableName: name,
            scope: scope,
            rows: rows
        };
        navigation_1.writeTableScope(this.outDataPath, tblScope);
    }
    Migrate(onElement) {
        rimraf.sync(this.outDataPath);
        this.walkElements(this.inDataPath, {
            onAccount: (account) => {
                const acc = onElement(account);
                if (acc && (acc === null || acc === void 0 ? void 0 : acc.type) == "account") {
                    logger("saving account %s", acc.name);
                    navigation_1.writeAccount(this.outDataPath, acc);
                    return acc;
                }
                return undefined;
            },
            onTable: (tableScope) => {
                const tblScope = onElement(tableScope);
                if (tblScope && tblScope.type == "tableScope") {
                    logger("saving table scope %s:%s:%s", tblScope.contract, tblScope.tableName, tblScope.scope);
                    navigation_1.writeTableScope(this.outDataPath, tblScope);
                    return tblScope;
                }
                return undefined;
            }
        });
    }
    async walkElements(dir, handlers) {
        walk_1.WalkFiles(dir, filePath => {
            const filename = navigation_1.getFilename(filePath);
            if (navigation_1.isAccount(filename)) {
                let account = this.newAccount(filePath);
                const acc = handlers.onAccount(account);
                if (acc) {
                    this.processAccount(navigation_1.getAccountPath(filePath), acc, handlers.onTable);
                }
            }
        });
    }
    newAccount(dirPath) {
        const accountName = navigation_1.getAccountName(dirPath);
        const account = {
            type: "account",
            name: accountName,
        };
        const abi = navigation_1.getABI(dirPath);
        if (abi) {
            account.abi = abi;
        }
        const wasm = navigation_1.getWasm(dirPath);
        if (wasm) {
            account.wasm = wasm;
        }
        const accountData = navigation_1.getAccount(dirPath);
        if (accountData) {
            account.data = accountData;
        }
        return account;
    }
    processAccount(accountPath, account, onTableScopeHandler) {
        logger("processing account: %s @ %s", account.name, accountPath);
        const tableDir = path.join(accountPath, "tables");
        if (!navigation_1.fileExists(tableDir)) {
            return false;
        }
        walk_1.WalkFiles(tableDir, filePath => {
            const tableScope = this.newTableScope(account, filePath);
            onTableScopeHandler(tableScope);
        });
    }
    newTableScope(account, rowsPath) {
        const { tableName, scope } = navigation_1.explodeRowsPath(rowsPath);
        const tableScope = {
            type: "tableScope",
            contract: account.name,
            tableName: tableName,
            scope: scope,
            rows: navigation_1.getRows(rowsPath)
        };
        return tableScope;
    }
}
exports.Migrator = Migrator;
//# sourceMappingURL=migrator.js.map