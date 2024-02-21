require("dotenv").config();

const apm = require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'control',

  // Use if APM Server requires a token
  secretToken: '',

  // Use if APM Server uses API keys for authentication
  apiKey: '',

  // Set custom APM Server URL (default: http://127.0.0.1:8200)
  serverUrl: 'http://localhost:8200',
});

const http = require('http')
// const patterns = require('patterns')()

// // Setup routes and their respective route handlers
// patterns.add('GET /', require('./routes/index'))
// patterns.add('GET /posts', require('./routes/posts').index)
// patterns.add('GET /posts/{id}', require('./routes/posts').show)

http.createServer(function (req, res) {
  // Check if we have a route matching the incoming request
  const match = {
    pattern: req.url,
    value: (req, res)=>{console.log("Matched");res.writeHead(200);res.end()},
    params: {test: 'ok'},
  }; // patterns.match(req.method + ' ' + req.url);

  // If no match is found, respond with a 404. Elastic APM will in
  // this case use the default transaction name "unknown route"
  if (!match) {
    res.writeHead(404)
    res.end()
    return
  }

  // The patterns module exposes the pattern used to match the
  // request on the `pattern` property, e.g. `GET /posts/{id}`
  apm.setTransactionName(match.pattern)

  // Populate the params and call the matching route handler
  const fn = match.value
  req.params = match.params
  console.log("request")
  fn(req, res)
}).listen(3000)
