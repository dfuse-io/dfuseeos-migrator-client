"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkFiles = void 0;
const fs = require("fs");
const path = require("path");
const navigation_1 = require("./navigation");
function WalkFiles(p, onFileHandler) {
    fs.readdirSync(p).forEach((f) => {
        const fullPath = path.join(p, f);
        if (navigation_1.isDir(fullPath)) {
            WalkFiles(fullPath, onFileHandler);
        }
        else {
            onFileHandler(fullPath);
        }
    });
}
exports.WalkFiles = WalkFiles;
//# sourceMappingURL=walk.js.map