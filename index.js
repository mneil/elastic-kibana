require("dotenv").config();
const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const { seed, createIndex } = require("./src");

async function main() {
  const client = new Client({
    node: "https://localhost:9200",
    auth: {
      apiKey: process.env.API_KEY,
    },
    tls: {
      ca: fs.readFileSync("./http_ca.crt"),
      rejectUnauthorized: false,
    },
  });

  const created = await createIndex(client, "search-metrics");
  if(!created) {
    console.log("Already bootstrapped. Nothing to do.");
    return;
  }
  console.log(await seed(client));

  // const searchResult = await client.search({
  //   index: 'search-metrics',
  //   q: 'snow'
  // });
  // console.log(searchResult.hits.hits)
}

main()
  .then()
  .catch((e) => console.log((e && e.message) || e));
