## dfuseeos migrator client

A quick tool that allows you to manipulate exported chain data. The chain data must
be exported via `dfuseeos migrate` CMD

### Overview

This framework will walk all the accounts, and table/scope pairs and pass each element to a callback 
function, at which point you can manipulate, edit and or delete data. Then the framework will 
save the data in a new directory  

the `run.ts` contains a detail example of how to manipulate the data

### Installation & Usage

Using yarn:

Install the dependency 

```
yarn add @dfuse/migrator-client
``` 

Loop through elements in your migration data to manipulate it

```
const { Migrator } = require("@dfuse/migrator-client")

const migrator = new Migrator("iput-data", "out")
migrator.Migrate((element) => {
    console.log("received a new element to manipulate)
    return element
})

```

## Examples & Development
If you want to familiarize yourself with the project, you can start by [forking the repository](https://help.github.com/articles/fork-a-repo/) and [cloning it in your local development environment](https://help.github.com/articles/cloning-a-repository/). 
The project requires [Node.js](https://nodejs.org) to be installed on your machine.

After cloning the repository, install the dependencies by running the following command in the directory of your cloned repository:

```bash
yarn install
```

You will need to link the project so that the example uses your local cloned repo as the library
and not the one published to npm

```bash
yarn link
yarn link "@dfuse/migrator-client"
```

You can run the existing tests to see if everything is okay by executing:

```bash
yarn run:example
```


You can run the node example with
```bash
node examples/runjs.js
```
