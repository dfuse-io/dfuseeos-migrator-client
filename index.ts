import { main as mainRun } from './run'
import { promises as fsPromises } from "fs"
const fs = require("fs");

async function main() {
  console.log(...process.argv)
  if (process.argv.length >= 3) {
    return mainRun(process.argv[2], process.argv[3])
  }

  console.log("usage:")
  console.log("  path/to/migration/data")
  process.exit(1)
}

main()