const { exec, echo } = require("shelljs")
const { exitOnError } = require("./helpers")

echo("Pushing code and tags...")

exitOnError(() => {
  exec(`git push origin --follow-tags`)
})

echo("Pushed branch & tags")
