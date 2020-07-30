
export type Limits = {
  cpu: number
  net: number
  ram: number
}

export type Element = Account | TableScope

export type Account = {
  type: "account"
  name: string
  limits: Limits
  data: string | Buffer
  abi?: string | Buffer
  wasm?: string | Buffer
}

export type TableScope = {
  type: "tableScope"
  contract: string
  tableName: string
  scope: string
  rows: Row[]
}

export type SecondaryIndex = {
  kind: string
  value: any
  payer: string
}

export type Row = {
  payer: string
  key: string
  json_data?: any
  hex_data?: any
  secondary_indexes: SecondaryIndex[]
}
