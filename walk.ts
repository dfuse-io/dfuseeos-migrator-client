const fs = require("fs");
const path = require("path");
import { isDir } from "./navigation"

export type OnFile = (filePath: string) => void

export function WalkFiles(p: string, onFileHandler: OnFile) {
  fs.readdirSync(p).forEach( (f: any) => {
    const fullPath = path.join(p, f);
    if (isDir(fullPath)) {
      WalkFiles(fullPath, onFileHandler)
    } else {
      onFileHandler(fullPath)
    }
  });
}