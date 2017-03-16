# Fog::DigitalOcean

[![Gem Version](https://badge.fury.io/rb/fog-digitalocean.svg)](https://badge.fury.io/rb/fog-digitalocean) [![Build Status](https://travis-ci.org/fog/fog-digitalocean.svg?branch=master)](https://travis-ci.org/fog/fog-digitalocean) [![Dependency Status](https://gemnasium.com/fog/fog-digitalocean.svg)](https://gemnasium.com/fog/fog-digitalocean) [![Coverage Status](https://coveralls.io/repos/github/fog/fog-digitalocean/badge.svg?branch=master)](https://coveralls.io/github/fog/fog-digitalocean?branch=master) [![Code Climate](https://codeclimate.com/github/fog/fog-digitalocean/badges/gpa.svg)](https://codeclimate.com/github/fog/fog-digitalocean) [![Join the chat at https://gitter.im/fog/fog-digitalocean](https://badges.gitter.im/fog/fog-digitalocean.svg)](https://gitter.im/fog/fog-digitalocean?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the plugin Gem to talk to [Digitalocean](http://digitalocean.org) clouds via fog.

The main maintainers for the Digitalocean sections are @jjasghar and @h0lyalg0rithm. Please send CC them on pull requests.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'fog-digitalocean'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fog-digitalocean

## Usage

### Initial Setup


# Getting started: the compute service

You'll need a DigitalOcean account and an API token to use this provider.

Get one from https://cloud.digitalocean.com/settings/tokens/new

Write down the Access Token.

## Connecting, retrieving and managing server objects

Before we start, I guess it will be useful to the reader to know
that Fog servers are 'droplets' in DigitalOcean's parlance.
'Server' is the Fog way to name VMs, and we have
respected that in the DigitalOcean's Fog provider.

First, create a connection to the host:

```ruby
require 'fog'

docean = Fog::Compute.new({
  :provider => 'DigitalOcean',
  :digitalocean_token   => 'poiuweoruwoeiuroiwuer', # your Access Token here
})
```

## SSH Key Management

Access to DigitalOcean servers can be managed with SSH keys. These can be assigned to servers at creation time so you can access them without having to use a password.

Creating a key:

```ruby
docean.ssh_keys.create(
  :name        => 'Default SSH Key',
  :ssh_pub_key => File.read('~/.ssh/id_rsa.pub'))
)
```

Listing all keys:

```ruby
docean.ssh_keys.each do | key |
  puts key.name
  puts key.public_key
  puts key.id
end
```

Destroying a key:

```ruby
docean.ssh_keys.destroy(:id => '27100')
```
## Listing servers

Listing servers and attributes:

```ruby
docean.servers.each do |server|
  # remember, servers are droplets
  puts server.id
  puts server.name
  puts server.status
  puts (server.image['slug'] || server.image['name']) # slug is only for public images, private images use name
  puts server.size['slug']
  puts server.region['slug']
end
```

## Server creation and life-cycle management

Creating a new server (droplet):

```ruby
server = docean.servers.create :name => 'foobar',
                               # use the last image listed
                               :image  => docean.images.last.id,
                               # use the first flavor (aka size) listed
                               :size => docean.flavors.first.slug,
                               # use the first region listed
                               :region => docean.regions.first.slug
```

The server is automatically started after that.

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/fog-digitalocean. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
