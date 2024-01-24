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

Go to [http://localhost:5601/app/management/security/api_keys](http://localhost:5601/app/management/security/api_keys) and create a new API key. You can give it any name. Do not change any settings, click create.

Create a new `.env` file in the root of this project and paste the api key there.

```sh
API_KEY=<token>
```
