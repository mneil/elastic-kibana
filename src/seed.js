const fs = require("fs");
const path = require("path");
const os = require("os");
const {faker} = require("@faker-js/faker");
const _ = require("lodash")

async function getData() {
  const cacheFile = path.join(__dirname, "seed.json");
  try {
    const res = await fs.promises.readFile(cacheFile, "utf8");
    return JSON.parse(res);
  }catch(e) {
    if(e.code !== "ENOENT") {
      throw(e);
    }
  }

  const environments = ['prod', 'dev', 'int'];
  const events = ["invocation", "error", "alert", "execution-time", "deploy"];
  const numApps = 5;
  const data = [];
  for(let i = 0; i < numApps; i++) {
    const name = _.kebabCase(faker.company.buzzNoun());
    const numRecords = faker.helpers.rangeToNumber({ min: 600, max: 10000 });
    for(let i = 0; i < numRecords; i++) {
      const time = faker.date.recent({ days: 14 });
      const event = _.sample(events);
      const environment = _.sample(environments);
      const value = event === "execution-time" ? faker.helpers.rangeToNumber({ min: 32, max: 3000 }) : 1;
      data.push({
        name,
        cloud: "aws",
        environment,
        event,
        value,
        time,
      });
    }
  }

  await fs.promises.writeFile(cacheFile, JSON.stringify(data));
  return data;
}
/**
 *
 * @param {@import("@elastic/elasticsearch").Client} client
 * @param {string} index
 */
async function createIndex(client, index = "search-metrics") {
  try {
    await client.indices.get({
      index,
    });
    return false
  } catch(e) {}
  // only make it here if the index doesn't already exist...

  await client.indices.create({
    index
  });

  await client.indices.putMapping({
    index,
    dynamic: "false",
    properties: {
      name: {
        type: "text",
        fields: {
          raw: {
            type:  "keyword",
          },
        },
      },
      version: { type: "keyword" },
      cloud: { type: "keyword" },
      environment: { type: "keyword" },
      event: { type: "keyword" },
      value: {
        type: "integer",
        fields: {
          raw: {
            type:  "keyword",
          },
        },
      },
      time: { type: "date" }
    },
  });

  return true;
}

async function seed(client) {

  const dataset = await getData();

  const result = await client.helpers.bulk({
    datasource: dataset,
    pipeline: "ent-search-generic-ingestion",
    onDocument: (doc) => ({ index: { _index: 'search-metrics' }}),
  });
  return result

}

module.exports = {
  seed,
  createIndex,
}
