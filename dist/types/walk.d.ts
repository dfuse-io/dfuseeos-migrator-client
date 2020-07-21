export declare type OnFile = (filePath: string) => void;
export declare function WalkFiles(p: string, onFileHandler: OnFile): void;
