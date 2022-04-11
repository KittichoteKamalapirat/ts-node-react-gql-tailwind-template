#!/bin/bash

echo What should the version be?
read VERSION
echo What is your dokku password?
read PASSWORD

docker build -t kittishane/cookknow:$VERSION .
docker push kittishane/cookknow:$VERSION     
# 139 => test-server
# 128 => production
ssh shane@128.199.205.119 "docker pull kittishane/cookknow:$VERSION && docker tag kittishane/cookknow:$VERSION dokku/server:$VERSION && echo $PASSWORD | sudo -S dokku tags:deploy server $VERSION"

# ssh shane@128.199.205.119 "echo $PASSWORD | sudo -S dokku tags:deploy server latest"