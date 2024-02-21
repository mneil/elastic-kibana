const fs = require("fs");
const path = require("path");

/**
 *
 */
async function backup(url, apiKey) {
  const headers = new Map([
    ["kbn-xsrf", "true"],
    ["Content-Type", "application/json"],
    ["Authorization", `ApiKey ${apiKey}`],
  ]);
  const res = await fetch(`${url}/api/saved_objects/_export`, {
    method: "POST",
    headers,
    body: JSON.stringify(
      {
        type: "dashboard",
        includeReferencesDeep: true,
      }
      // {
      //   "objects": [
      //     {
      //       "type": "dashboard",
      //       "id": "be3733a0-9efe-11e7-acb3-3dab96693fab"
      //     }
      //   ]
      // }
    ),
  });
  await fs.promises.writeFile(path.join(__dirname, "dashboard.ndjson"), await res.text())

  // curl -X POST api/saved_objects/_export -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '
  // {
  //   "objects": [
  //     {
  //       "type": "dashboard",
  //       "id": "be3733a0-9efe-11e7-acb3-3dab96693fab"
  //     }
  //   ]
  // }'
}

module.exports = { backup };
