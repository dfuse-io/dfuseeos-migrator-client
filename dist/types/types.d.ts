/// <reference types="node" />
export declare type Limits = {
    cpu: number;
    net: number;
    ram: number;
};
export declare type Element = Account | TableScope;
export declare type Account = {
    type: "account";
    name: string;
    limits: Limits;
    data: AccountInfo;
    abi?: string | Buffer;
    wasm?: string | Buffer;
};
export declare type AccountInfo = {
    permissions: Permission[];
    link_auths?: LinkAuth[] | undefined;
};
export declare type LinkAuth = {
    permission: string;
    contract: string;
    action: string;
};
export declare type Permission = {
    parent?: string;
    owner: string;
    name: string;
    authority: Authority;
};
export declare type Authority = {
    threshold: number;
    keys?: KeyWeightPermission[];
    accounts?: AccountWeightPermission[];
    waits?: WaitWeight[];
};
export declare type WaitWeight = {
    wait_sec: number;
    weight: number;
};
export declare type KeyWeightPermission = {
    key: string;
    weight: number;
};
export declare type AccountWeightPermission = {
    permission: AccountPermissionLevel;
    weight: number;
};
export declare type AccountPermissionLevel = {
    permission: string;
    actor: string;
};
export declare type TableScope = {
    type: "tableScope";
    contract: string;
    tableName: string;
    scope: string;
    rows: Row[];
};
export declare type SecondaryIndex = {
    kind: string;
    value: any;
    payer: string;
};
export declare type Row = {
    payer: string;
    key: string;
    json_data?: any;
    hex_data?: any;
    secondary_indexes: SecondaryIndex[];
};
