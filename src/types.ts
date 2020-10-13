
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
  data: AccountInfo
  abi?: string | Buffer
  wasm?: string | Buffer
}

export type AccountInfo = {
  permissions: Permission[]
  link_auths?: LinkAuth[] | undefined
}

export type LinkAuth  =  {
  permission: string
  contract:   string
  action:     string
}

export type Permission = {
  parent?: string
  owner: string
  name: string
  authority: Authority
}

export type Authority = {
  threshold: number
  keys?: KeyWeightPermission[]
  accounts?: AccountWeightPermission[]
  waits?: WaitWeight[]
}

export type WaitWeight = {
  wait_sec: number
  weight: number
}

export type KeyWeightPermission = {
  key: string
  weight: number
}

export type AccountWeightPermission = {
  permission: AccountPermissionLevel
  weight: number
}

export type AccountPermissionLevel = {
  permission: string
  actor: string
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
