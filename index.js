require("dotenv").config();
const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const { seed, createIndex, backup } = require("./src");

async function main() {
  const elasticUrl = "https://localhost:9200";
  const kibanaUrl = "http://localhost:5601";
  const apiKey = process.env.API_KEY;
  const cert = fs.readFileSync("./http_ca.crt");

  const client = new Client({
    node: elasticUrl,
    auth: {
      apiKey,
    },
    tls: {
      ca: cert,
      rejectUnauthorized: false,
    },
  });

  await backup(kibanaUrl, apiKey);
  return;

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
