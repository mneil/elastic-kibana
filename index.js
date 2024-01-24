require("dotenv").config();
const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");
const { seed } = require("./src");

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
  // await client.indices.create({
  //   index: "search-metrics",
  //   mappings: {
  //     dynamic: "true",
  //     dynamic_templates: [
  //       {
  //         all_text_fields: {
  //           match_mapping_type: "string",
  //           mapping: {
  //             analyzer: "iq_text_base",
  //             fields: {
  //               delimiter: {
  //                 analyzer: "iq_text_delimiter",
  //                 type: "text",
  //                 index_options: "freqs",
  //               },
  //               joined: {
  //                 search_analyzer: "q_text_bigram",
  //                 analyzer: "i_text_bigram",
  //                 type: "text",
  //                 index_options: "freqs",
  //               },
  //               prefix: {
  //                 search_analyzer: "q_prefix",
  //                 analyzer: "i_prefix",
  //                 type: "text",
  //                 index_options: "docs",
  //               },
  //               enum: {
  //                 ignore_above: 2048,
  //                 type: "keyword",
  //               },
  //               stem: {
  //                 analyzer: "iq_text_stem",
  //                 type: "text",
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  // });

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
