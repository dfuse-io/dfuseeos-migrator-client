const fs = require("fs");
const path = require("path");
const logger = require('debug')('dfuse:migrator')
import { Account, Limits, Element, Row, TableScope, AccountInfo } from "./types"
import {
  getAccountName,
  isAccount,
  getFilename,
  getABI,
  getWasm,
  writeAccount,
  writeTableScope,
  getAccountInfo,
  explodeRowsPath,
  getAccountPath,
  fileExists,
  getRows,
  cleanDir,
} from "./navigation"
import { WalkFiles, OnFile } from "./walk"

export type OnTableScope = (table: TableScope) => (TableScope | undefined)

interface walkSpec {
  onAccount: (account: Account) => (Account | undefined)
  onTable: OnTableScope
}
export class Migrator {
  inDataPath: string
  outDataPath: string
  deletedAccount: string[]

  constructor(inputData: string, outputData: string) {
    this.inDataPath = inputData
    this.outDataPath = outputData
    this.deletedAccount = []
  }

  AddAccount(
    name: string,
    spec: {
      abi?: string | Buffer
      wasm?: string | Buffer
      info?: AccountInfo
      limits?: Limits
    } = {}
  ) {
    const account = {
      type: "account",
      name: name,
      limits: spec.limits,
      data: spec.info || {},
      abi: spec.abi,
      wasm: spec.wasm,
    } as Account
    writeAccount(this.outDataPath, account)
  }

  AddTable(contract: string, name: string, scope: string, rows: Row[]) {
    const tblScope = {
      type: "tableScope",
      contract: contract,
      tableName: name,
      scope: scope,
      rows: rows
    } as TableScope
    writeTableScope(this.outDataPath, tblScope)
  }

  Migrate(onElement: (element: Element) => Element | undefined): void {
    cleanDir(this.outDataPath)
    if (!fileExists(this.inDataPath)) {
      throw("Cannot find input migration data located at '" + this.inDataPath + "'")
      return
    }

    this.walkElements(this.inDataPath, {
      onAccount: (account: Account): (Account | undefined) => {
        const acc = onElement(account)
        if (acc && acc?.type == "account") {
          logger("saving account %s", acc.name)
          writeAccount(this.outDataPath, acc)
          return acc
        }
        return undefined
      },
      onTable: (tableScope: TableScope): (TableScope | undefined) =>  {
        const tblScope = onElement(tableScope)
        if (tblScope && tblScope.type == "tableScope") {
          logger("saving table scope %s:%s:%s", tblScope.contract, tblScope.tableName, tblScope.scope)
          writeTableScope(this.outDataPath, tblScope)
          return tblScope
        }
        return undefined
      }
    })
  }

  async walkElements(dir: string, handlers: walkSpec) {
    WalkFiles(dir, filePath => {
      const filename = getFilename(filePath)
      if (isAccount(filename)) {
        let account = this.newAccount(filePath)
        const acc = handlers.onAccount(account)
        if (acc) {
          this.processAccount(getAccountPath(filePath), acc, handlers.onTable)
        }
      }
    })
  }

  newAccount(dirPath: string): Account {
    const accountName = getAccountName(dirPath)
    const account = {
      type: "account",
      name: accountName,
      // limits: Limits
    } as Account

    const abi = getABI(dirPath)
    if (abi) {
      account.abi = abi
    }
    const wasm = getWasm(dirPath)
    if (wasm) {
      account.wasm = wasm
    }
    const accountData = getAccountInfo(dirPath)
    account.data = accountData
    return account
  }

  processAccount(accountPath: string,account: Account, onTableScopeHandler: OnTableScope) {
    logger("processing account: %s @ %s",account.name, accountPath)
    const tableDir = path.join(accountPath,"tables")
    if (!fileExists(tableDir)) {
      return false
    }

    WalkFiles(tableDir, filePath => {
      const tableScope = this.newTableScope(account, filePath)
      onTableScopeHandler(tableScope)
    })
  }

  newTableScope(account: Account, rowsPath: string): TableScope {
    const { tableName, scope } = explodeRowsPath(rowsPath)
    const tableScope ={
      type: "tableScope",
      contract: account.name,
      tableName: tableName,
      scope: scope,
      rows: getRows(rowsPath)
    }

    return tableScope as TableScope
  }
}
