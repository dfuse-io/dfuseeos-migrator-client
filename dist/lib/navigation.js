"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDir = exports.fileExists = exports.getAccountPath = exports.getFilename = exports.isDir = exports.writeTableScope = exports.writeWasm = exports.writeABI = exports.writeAccountInfo = exports.writeAccount = exports.getRows = exports.explodeRowsPath = exports.getAccount = exports.getWasm = exports.getABI = exports.isTableScope = exports.isAccount = exports.getAccountName = void 0;
const fs = require("fs");
const logger = require('debug')('dfuse:helper');
const errLogger = require('debug')('dfuse:helper:error');
const rimraf = require("rimraf");
const path = require('path');
function getAccountName(accountJsonPath) {
    const chunks = accountJsonPath.split("/");
    return decodeName(chunks[chunks.length - 2]);
}
exports.getAccountName = getAccountName;
function isAccount(fileName) {
    return fileName == "account.json";
}
exports.isAccount = isAccount;
function isTableScope(fileName) {
    return fileName == "rows.json";
}
exports.isTableScope = isTableScope;
function getABI(accountJsonPath) {
    const chunks = accountJsonPath.split("/");
    chunks[chunks.length - 1] = "abi.json";
    return readFile(path.join(...chunks));
}
exports.getABI = getABI;
function getWasm(accountJsonPath) {
    const chunks = accountJsonPath.split("/");
    chunks[chunks.length - 1] = "code.wasm";
    return readFile(path.join(...chunks));
}
exports.getWasm = getWasm;
function getAccount(accountJsonPath) {
    return readFile(accountJsonPath);
}
exports.getAccount = getAccount;
function explodeRowsPath(rowsPath) {
    const chunks = rowsPath.split("/");
    let tableName = "";
    let scope = chunks[chunks.length - 2];
    let itr = 0;
    chunks.forEach(chunk => {
        if (chunk === 'tables') {
            tableName = chunks[itr + 1];
        }
        itr += 1;
    });
    return {
        tableName: decodeName(tableName),
        scope: decodeName(scope)
    };
}
exports.explodeRowsPath = explodeRowsPath;
function getRows(rowsJsonPath) {
    try {
        const rowsCnt = readFile(rowsJsonPath);
        if (rowsCnt) {
            const rows = JSON.parse(rowsCnt.toString());
            return rows;
        }
        errLogger("Unable to retrieve content of rows.json @ %s", rowsJsonPath);
    }
    catch (error) {
        errLogger("Unable to parse rows.json @ %s", rowsJsonPath);
    }
    return [];
}
exports.getRows = getRows;
// Writers
function writeAccount(basePath, account) {
    const encodedName = encodeName(account.name);
    const chunks = nestedPath(encodedName).split("/");
    const accountPath = path.join(basePath, ...chunks);
    logger("writing account %s at %s", account.name, accountPath);
    fs.mkdirSync(accountPath, { recursive: true });
    writeAccountInfo(accountPath, account);
    writeABI(accountPath, account);
    writeWasm(accountPath, account);
}
exports.writeAccount = writeAccount;
function writeAccountInfo(accountPath, account) {
    try {
        const resp = fs.writeFileSync(path.join(accountPath, "account.json"), account.data);
    }
    catch (e) {
        errLogger("unable to write account.json for account %s @ %s", account.name, accountPath);
    }
}
exports.writeAccountInfo = writeAccountInfo;
function writeABI(accountPath, account) {
    if (!account.abi) {
        return;
    }
    try {
        const resp = fs.writeFileSync(path.join(accountPath, "abi.json"), account.abi);
    }
    catch (e) {
        errLogger("unable to write abi.json for account %s @ %s", account.name, accountPath);
    }
}
exports.writeABI = writeABI;
function writeWasm(accountPath, account) {
    if (!account.wasm) {
        return;
    }
    try {
        const resp = fs.writeFileSync(path.join(accountPath, "code.wasm"), account.wasm);
    }
    catch (e) {
        errLogger("unable to write code.wasm for account %s @ %s", account.name, accountPath);
    }
}
exports.writeWasm = writeWasm;
function writeTableScope(basePath, tblScope) {
    const encodedContractName = encodeName(tblScope.contract);
    const encodedTblName = encodeName(tblScope.tableName);
    const encodedScopeName = encodeName(tblScope.scope);
    const accountPath = path.join(basePath, ...nestedPath(encodedContractName).split("/"));
    const tablePath = path.join(accountPath, "tables", encodedTblName);
    const scopePath = path.join(tablePath, ...nestedPath(encodedScopeName).split("/"));
    logger("writing table scope %s:%s:%s at %s", tblScope.contract, tblScope.tableName, tblScope.scope, scopePath);
    fs.mkdirSync(scopePath, { recursive: true });
    try {
        const rowsCnt = JSON.stringify(tblScope.rows);
        const resp = fs.writeFileSync(path.join(scopePath, "rows.json"), rowsCnt);
    }
    catch (e) {
        console.log("error writting");
    }
}
exports.writeTableScope = writeTableScope;
// Navigation helpers
function isDir(dirPath) {
    return fs.statSync(dirPath).isDirectory();
}
exports.isDir = isDir;
function getFilename(dirPath) {
    return dirPath.split("/").pop() || "";
}
exports.getFilename = getFilename;
function getAccountPath(dirPath) {
    const chunks = dirPath.split("/");
    chunks.pop();
    return chunks.join("/");
}
exports.getAccountPath = getAccountPath;
function fileExists(filepath) {
    return fs.existsSync(filepath);
}
exports.fileExists = fileExists;
function cleanDir(dirPath) {
    rimraf.sync(dirPath);
}
exports.cleanDir = cleanDir;
function readFile(absFilepath) {
    if (!absFilepath.startsWith("/")) {
        absFilepath = "/" + absFilepath;
    }
    if (fileExists(absFilepath)) {
        return fs.readFileSync(absFilepath);
    }
    return undefined;
}
function nestedPath(entityName) {
    if (entityName.length <= 2) {
        return entityName;
    }
    else if (entityName.length <= 4) {
        return [entityName.substring(0, 2), entityName].join("/");
    }
    else {
        return [entityName.substring(0, 2), entityName.substring(2, 4), entityName].join("/");
    }
}
function encodeName(name) {
    return name.replace(/\./g, "_");
}
function decodeName(name) {
    return name.replace(/_/g, ".");
}
//# sourceMappingURL=navigation.js.map