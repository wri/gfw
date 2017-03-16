# Fog::Dnsimple

[![Build Status](https://travis-ci.org/fog/fog-dnsimple.svg?branch=master)](https://travis-ci.org/fog/fog-dnsimple)


## API Version

This library currently uses the [DNSimple API v1](https://developer.dnsimple.com/v1/) 
and it is fully compatible with the legacy implementation bundled with the `fog` gem.

In other words, this is a drop-in replacement. Please note that the `dnsimple` provider
will eventually be removed from the `fog` gem in favor of this fog-specific module.


## Installation

Add this line to your application's Gemfile:

```ruby
gem 'fog-dnsimple'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fog-dnsimple


## Usage

Initialize a `Fog::DNS` object using the DNSimple provider.

```ruby
dns = Fog::DNS.new({
  provider:       "DNSimple",
  dnsimple_email: "YOUR_EMAIL",
  dnsimple_token: "YOUR_API_V1_TOKEN",
})
```

This can then be used like other [Fog DNS](http://fog.io/dns/) providers.

```ruby
zone = dns.zones.create(
  domain: "example.com
)
record = zone.records.create(
  name: "example.com,
  value: "1.2.3.4,
  type: "A"
)
```

The following configurations are supported:

```ruby
dns = Fog::DNS.new({
  # Use dnsimple_url to provide a different base URL, e.g. the Sandbox URL
  dnsimple_url:   "https://api.sandbox.dnsimple.com/",

  # API v1 token-based authentication
  dnsimple_email: "...",
  dnsimple_token: "...",

  # API v1 basic-auth
  dnsimple_email: "...",
  dnsimple_password: "...",

  # API v1 domain-token authentication
  dnsimple_domain: "example.com",
  dnsimple_token: "...",
})
```

## Contributing

1. Fork it ( https://github.com/fog/fog-dnsimple/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
