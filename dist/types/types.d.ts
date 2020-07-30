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
    data: string | Buffer;
    abi?: string | Buffer;
    wasm?: string | Buffer;
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
