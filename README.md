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

For now you have to go to [http://localhost:5601/app/apm/services](http://localhost:5601/app/apm/services) and setup the APM integration. The integration creates an APM policy and index. You do not need to add an agent or change any settings. Once it asks you to add an agent you can skip the step. This is a one-time setup.

Run `npm run otel` to start a node app that will send APM metics to elastic.

Run `wget -qO- localhost:3000/test` to send metrics. Change the url path to create different transactions in the control service.

You can also auto-generate random metrics with `npm run siege`. [Siege](https://github.com/JoeDog/siege) must be installed in order to use this command.
