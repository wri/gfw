#!/bin/sh
rvm 1.8.7@cartodb-rb-client
bundle install
rvm 1.9.2@cartodb-rb-client
bundle install
rvm 1.8.7@cartodb-rb-client,1.9.2@cartodb-rb-client rake spec