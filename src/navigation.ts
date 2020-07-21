const fs = require("fs");
const logger = require('debug')('dfuse:helper')
const errLogger = require('debug')('dfuse:helper:error')
const  rimraf = require("rimraf");

const path = require('path');

import { Account, Row, TableScope } from "./types"

export function getAccountName(accountJsonPath: string): string {
  const chunks = accountJsonPath.split("/")
  return decodeName(chunks[chunks.length - 2])
}

export function isAccount(fileName: string): boolean {
  return fileName == "account.json"
}

export function isTableScope(fileName: string): boolean {
  return fileName == "rows.json"
}

export function getABI(accountJsonPath: string): (Buffer | undefined){
  const chunks = accountJsonPath.split("/")
  chunks[chunks.length -1] = "abi.json"
  return readFile(path.join(...chunks))
}

export function getWasm(accountJsonPath: string): (Buffer | undefined){
  const chunks = accountJsonPath.split("/")
  chunks[chunks.length -1] = "code.wasm"
  return readFile(path.join(...chunks))
}

export function getAccount(accountJsonPath: string): (Buffer | undefined){
  return readFile(accountJsonPath)
}

export function explodeRowsPath(rowsPath: string): {tableName: string, scope: string}  {
  const chunks = rowsPath.split("/")
  let tableName = ""
  let scope = chunks[chunks.length-2]
  let itr = 0
  chunks.forEach( chunk => {
    if (chunk === 'tables') {
      tableName = chunks[itr+1]
    }
    itr += 1
  })

  return {
    tableName: decodeName(tableName),
    scope: decodeName(scope)
  };
}

export function getRows(rowsJsonPath: string): Row[] {
  try {
    const rowsCnt = readFile(rowsJsonPath)
    if (rowsCnt) {
      const rows = JSON.parse(rowsCnt.toString())
      return rows as Row[]
    }
    errLogger("Unable to retrieve content of rows.json @ %s",rowsJsonPath)
  } catch (error) {
    errLogger("Unable to parse rows.json @ %s",rowsJsonPath)
  }

  return []
}


// Writers
export function writeAccount(basePath: string, account: Account) {
  const encodedName = encodeName(account.name)
  const chunks = nestedPath(encodedName).split("/")
  const accountPath = path.join(basePath, ...chunks)
  logger("writing account %s at %s", account.name, accountPath)
  fs.mkdirSync(accountPath,{ recursive: true });
  writeAccountInfo(accountPath, account)
  writeABI(accountPath, account)
  writeWasm(accountPath, account)
}

export function writeAccountInfo(accountPath: string, account: Account) {
  try{
    const resp = fs.writeFileSync(path.join(accountPath, "account.json"),account.data)
  }catch (e) {
    errLogger("unable to write account.json for account %s @ %s", account.name, accountPath)
  }
}


export function writeABI(accountPath: string, account: Account) {
  if (!account.abi) {
    return
  }
  try{
    const resp = fs.writeFileSync(path.join(accountPath, "abi.json"),account.abi)
  }catch (e) {
    errLogger("unable to write abi.json for account %s @ %s", account.name, accountPath)
  }
}

export function writeWasm(accountPath: string, account: Account) {
  if (!account.wasm) {
    return
  }
  try{
    const resp = fs.writeFileSync(path.join(accountPath, "code.wasm"),account.wasm)
  }catch (e) {
    errLogger("unable to write code.wasm for account %s @ %s", account.name, accountPath)
  }
}

export function writeTableScope(basePath: string, tblScope: TableScope) {
  const encodedContractName = encodeName(tblScope.contract)
  const encodedTblName = encodeName(tblScope.tableName)
  const encodedScopeName = encodeName(tblScope.scope)

  const accountPath = path.join(basePath, ...nestedPath(encodedContractName).split("/"))
  const tablePath = path.join(accountPath, "table", encodedTblName)
  const scopePath = path.join(tablePath, ...nestedPath(encodedScopeName).split("/"))
  logger("writing table scope %s:%s:%s at %s", tblScope.contract, tblScope.tableName, tblScope.scope, scopePath)
  fs.mkdirSync(scopePath,{ recursive: true });
  try{
    const rowsCnt = JSON.stringify(tblScope.rows)
    const resp = fs.writeFileSync(path.join(scopePath, "rows.json") ,rowsCnt)
  }catch (e) {
    console.log("error writting")
  }
}


// Navigation helpers
export function isDir(dirPath: string):boolean {
  return fs.statSync(dirPath).isDirectory();
}

export function getFilename(dirPath: string): string {
  return dirPath.split("/").pop() || ""
}

export function getAccountPath(dirPath: string): string {
  const chunks = dirPath.split("/")
  chunks.pop()
  return  chunks.join("/")
}

export function fileExists(filepath: string): boolean {
  return fs.existsSync(filepath)
}

export function cleanDir(dirPath: string) {
  rimraf.sync(dirPath)
}

function readFile(absFilepath: string): (Buffer | undefined) {
  if (!absFilepath.startsWith("/")) {
    absFilepath = "/" + absFilepath
  }
  if (fileExists(absFilepath)) {
    return fs.readFileSync(absFilepath)
  }
  return undefined
}

function nestedPath(entityName: string): string {
  if (entityName.length <= 2) {
    return entityName
  } else if (entityName.length <= 4) {
    return [entityName.substring(0, 2), entityName].join("/")
  } else {
    return [entityName.substring(0, 2), entityName.substring(2, 4), entityName].join("/")
  }
}


function encodeName(name: string): string {
  return name.replace(/\./g, "_")
}

function decodeName(name: string): string {
  return name.replace(/_/g, ".")
}
