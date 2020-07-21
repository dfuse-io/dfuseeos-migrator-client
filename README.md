## dfuseeos migrator client

A quick tool that allows you to manipulate exported chain data. The chain data must
be exported via `dfuseeos migrate` CMD

### Overview

The framework will walk all the accounts, and table/scope pairs and pass each element to a callback 
function, at which point you can manipulate, edit and or delete data. Then the framework will 
save the data in a new directory  

the `run.ts` contains a detail example of how to manipulate the data

### Usage

```
yarn install
yarn ts-node index.ts [input-data] [output-data]
``` 
