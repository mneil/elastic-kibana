# Elastic example

## Setup

run `docker-compose up` to run the application.

open [http://localhost:5601/](http://localhost:5601/)

### Configure Kibana

Once you open the browser you need to authenticate kibana with the elasticsearch database. Run these commands and copy the enrollment token
first to kiban then the verification code.

```sh
# get server certificate for client tls
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/http_ca.crt http_ca.crt
# generate a new user
docker exec -it elasticsearch ./bin/elasticsearch-users useradd admin -p adminadmin -r superuser
# generate a new secret token
docker exec -it elasticsearch ./bin/elasticsearch-create-enrollment-token --scope kibana
# get the verification code for kibana
docker exec -it kibana ./bin/kibana-verification-code
```

You can now login to kibana with `admin` user and `adminadmin` password.

### Configure Environment

Install nodejs dependencies

```sh
npm i
```

Go to [http://localhost:5601/app/management/security/api_keys](http://localhost:5601/app/management/security/api_keys) and create a new API key. You can give it any name. Do not change any settings, click create.

Create a new `.env` file in the root of this project and paste the api key there.

```sh
API_KEY=<token>
```

Execute the setup scripts to create an index and prefill it with data

```sh
node ./index.js
# {
#   total: 34901,
#   failed: 0,
#   retry: 0,
#   successful: 34901,
#   noop: 0,
#   time: 1294,
#   bytes: 5408138,
#   aborted: false
# }
```

## APM

TODO: Do we need to even configure APM first? IDK

```sh
curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-8.11.0-linux-x86_64.tar.gz\n
tar xzvf apm-server-8.11.0-linux-x86_64.tar.gz\n
cd apm-server-8.11.0-linux-x86_64
# copy apm-server.yml to apm-server-8.11.0-linux-x86_64
./apm-server -e
```

Below are the contents of apm-server.yml. You need to configure the full path to the CA cert on disk

```yml
# contents of apm-server.yml
apm-server:
  # Defines the host and port the server is listening on. Use "unix:/path/to.sock" to listen on a unix domain socket.
  host: "127.0.0.1:8200"
output.elasticsearch:
  # Array of hosts to connect to.
  # Scheme and port can be left out and will be set to the default (`http` and `9200`).
  # In case you specify and additional path, the scheme is required: `http://localhost:9200/path`.
  # IPv6 addresses should always be defined as: `https://[2001:db8::1]:9200`.
  hosts: ["localhost:9200"]

  # Protocol - either `http` (default) or `https`.
  protocol: "https"

  # Authentication credentials - either API key or username/password.
  #api_key: "id:api_key"
  username: "admin"
  password: "adminadmin"

  # List of root certificates for HTTPS server verifications.
  ssl.certificate_authorities: ["${REPLACE WITH ABSOLUTE PATH TO THIS FILE}/http_ca.crt"]
```
