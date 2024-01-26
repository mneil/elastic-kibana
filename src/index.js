const seed = require("./seed");
const dashboard = require("./dashboard");

module.exports = {
  seed: seed.seed,
  createIndex: seed.createIndex,
  backup: dashboard.backup,
}
