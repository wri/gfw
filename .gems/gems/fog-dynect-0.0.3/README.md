# Fog::Dynect

[![Build Status](https://travis-ci.org/fog/fog-dynect.svg?branch=master)](https://travis-ci.org/fog/fog-dynect)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'fog-dynect'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fog-dynect

## Usage

Initialize a `Fog::DNS` object using the Dynect provider.

```ruby

dns = Fog::DNS.new({
  :provider => 'Dynect',
  :dynect_customer => 'dynect_customer',
  :dynect_username => 'dynect_username',
  :dynect_password => 'dynect_password'
})

```

This can then be used like other [Fog DNS](http://fog.io/dns/) providers.

```ruby

zone = dns.zones.create(
  :domain => 'example.com',
  :email  => 'admin@example.com'
)
record = zone.records.create(
  :value   => '1.2.3.4',
  :name => 'example.com',
  :type => 'A'
)

```

## Contributing

1. Fork it ( https://github.com/fog/fog-dynect/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
