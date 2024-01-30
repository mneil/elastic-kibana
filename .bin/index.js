#!/usr/bin/env node
require("dotenv").config();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const { seed, createIndex, backup } = require("../src");

const optionIndex = {
  index: {
    alias: 'i',
    default: 'search-metrics'
  }
}

const positionalRestoreBackup = {
  describe: 'restore or backup',
  choices: ['restore', 'backup'],
  default: 'restore'
}

yargs(hideBin(process.argv))
  .middleware(configure)
  .command(
    ['init', '$0'],
    'create an index, seed it, and create a dashboard',
    {
      ...optionIndex,
    },
    async (argv) => {
      await createIndex(argv.client, argv.index);
      await seed(argv.client, argv.index);
      // await restore(argv.kibanaUrl, argv.apiKey);
    })
  .command(
    ['seed'],
    'seed an index',
    {
      ...optionIndex,
    },
    async (argv) => {
      await seed(argv.client, argv.index);
    })
  .command(
    ['index'],
    'create an index',
    {
      ...optionIndex,
    },
    async (argv) => {
      await createIndex(argv.client, argv.index);
    })
  .command(
    ['dashboard [restoreBackup]'],
    'restore or backup dashboards',
    (yargs) => {
      yargs.positional('restoreBackup', positionalRestoreBackup);
    },
    async (argv) => {
      await backup(argv.kibanaUrl, argv.apiKey);
    })
  .option('elasticUrl',  {
    hidden: true,
    type: 'string',
    default: process.env.ELASTIC_URL || 'https://localhost:9200',
    description: 'URL of the elasticsearch server',
  })
  .option('kibanaUrl',  {
    hidden: true,
    type: 'string',
    default: process.env.KIBANA_URL || 'http://localhost:5601',
    description: 'URL of the Kibana server',
  })
  .option('apiKey',  {
    hidden: true,
    type: 'string',
    default: process.env.API_KEY,
    description: 'URL of the Kibana server',
  })
  .parse();

function configure(argv) {
  const cert = fs.readFileSync("./http_ca.crt");
  return {
    cert,
    client: new Client({
      node: argv.elasticUrl,
      auth: {
        apiKey: argv.apiKey,
      },
      tls: {
        ca: cert,
        rejectUnauthorized: false,
      },
    }),
  };
}



// async function main() {
//   const elasticUrl = "https://localhost:9200";
//   const kibanaUrl = "http://localhost:5601";
//   const apiKey = process.env.API_KEY;
//   const cert = fs.readFileSync("./http_ca.crt");

//   const client = new Client({
//     node: elasticUrl,
//     auth: {
//       apiKey,
//     },
//     tls: {
//       ca: cert,
//       rejectUnauthorized: false,
//     },
//   });

//   await backup(kibanaUrl, apiKey);
//   return;

//   const created = await createIndex(client, "search-metrics");
//   if(!created) {
//     console.log("Already bootstrapped. Nothing to do.");
//     return;
//   }
//   console.log(await seed(client));


//   // const searchResult = await client.search({
//   //   index: 'search-metrics',
//   //   q: 'snow'
//   // });
//   // console.log(searchResult.hits.hits)
// }

// main()
//   .then()
//   .catch((e) => console.log((e && e.message) || e));
