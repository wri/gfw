# Fog::Radosgw

[![Gem Version](https://badge.fury.io/rb/fog-radosgw.svg)](http://badge.fury.io/rb/fog-radosgw) [![Build Status](https://travis-ci.org/fog/fog-radosgw.svg?branch=master)](https://travis-ci.org/fog/fog-radosgw) [![Dependency Status](https://gemnasium.com/fog/fog-radosgw.svg)](https://gemnasium.com/fog/fog-radosgw) [![Coverage Status](https://img.shields.io/coveralls/fog/fog-radosgw.svg)](https://coveralls.io/r/fog/fog-radosgw) [![Code Climate](https://codeclimate.com/github/fog/fog-radosgw.png)](https://codeclimate.com/github/fog/fog-radosgw) [![Stories in Ready](https://badge.waffle.io/fog/fog-radosgw.png?label=ready&title=Ready)](https://waffle.io/fog/fog-radosgw)

Fog backend for provisioning Ceph Radosgw - the Swift and S3 compatible REST API for Ceph.
Currently, the gem only supports the S3 API, not Swift.

Based on the Riak CS backend.

## Installation

Add this line to your application's Gemfile:

    gem 'fog-radosgw'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fog-radosgw

## Usage

Example:

    require 'fog/radosgw'

    provision_client =  Fog::Radosgw::Provisioning.new(
        host:    'objects.example.com',
        radosgw_access_key_id:     'CHIA1GEE0EIJ9OHSAIK6',
        radosgw_secret_access_key: 'IFooJ7airaebaele6baihaiw2fequuto9Foh7Sei'
    )

    response = provision_client.create_user('fog', 'Fog User', 'fog@example.com')
    userkey    = response.body['keys'][0]['access_key']
    usersecret = response.body['keys'][0]['secret_key']

## Tests

Mock tests:

    bundle exec rake mock[radosgw]

Live tests:

    bundle exec rake live[radosgw]

To run live tests, you have to place credentials in `tests/.fog`, e.g.:

    default:
        host:    objects.example.com
        radosgw_access_key_id:     CHIA1GEE0EIJ9OHSAIK6
        radosgw_secret_access_key: IFooJ7airaebaele6baihaiw2fequuto9Foh7Sei

## Contributing

Please refer to the
[CONTRIBUTING.md](https://github.com/fog/fog/blob/master/CONTRIBUTING.md)
page for the main Fog project.

## License

Please refer to [LICENSE.md](https://github.com/fog/fog-radosgw/blob/master/LICENSE.md).
