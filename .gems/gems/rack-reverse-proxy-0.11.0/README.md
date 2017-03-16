# A Reverse Proxy for Rack
[![TravisCI](https://secure.travis-ci.org/waterlink/rack-reverse-proxy.svg "Build Status")](http://travis-ci.org/waterlink/rack-reverse-proxy "Build Status")

This is a simple reverse proxy for Rack that pretty heavily rips off Rack Forwarder. It is not meant for production systems (although it may work), as the webserver fronting your app is generally much better at this sort of thing.

## Installation
The gem is available on rubygems.  Assuming you have a recent version of Rubygems you should just be able to install it via:

```
gem install rack-reverse-proxy
```

For your Gemfile use:

```ruby
gem "rack-reverse-proxy", require: "rack/reverse_proxy"
```

## Usage

Rules can be a regex or a string. If a regex is used, you can use the subcaptures in your forwarding url by denoting them with a `$`.

Right now if more than one rule matches any given route, it throws an exception for an ambiguous match.  This will probably change later. If no match is found, the call is forwarded to your application.

Below is an example for configuring the middleware:

```ruby
require 'rack/reverse_proxy'

use Rack::ReverseProxy do
  # Set :preserve_host to true globally (default is true already)
  reverse_proxy_options preserve_host: true

  # Forward the path /test* to http://example.com/test*
  reverse_proxy '/test', 'http://example.com/'

  # Forward the path /foo/* to http://example.com/bar/*
  reverse_proxy /^\/foo(\/.*)$/, 'http://example.com/bar$1', username: 'name', password: 'basic_auth_secret'
end

app = proc do |env|
  [ 200, {'Content-Type' => 'text/plain'}, "b" ]
end
run app
```

`reverse_proxy_options` sets global options for all reverse proxies. Available options are:

* `:preserve_host` Set to false to omit Host headers
* `:username` username for basic auth
* `:password` password for basic auth
* `:matching` is a global only option, if set to :first the first matched url will be requested (no ambigous error). Default: :all.
* `:timeout` seconds to timout the requests
* `:force_ssl` redirects to ssl version, if not already using it (requires `:replace_response_host`). Default: false.
* `:verify_mode` the `OpenSSL::SSL` verify mode passed to Net::HTTP. Default: `OpenSSL::SSL::VERIFY_PEER`.
* `:x_forwarded_headers` sets up proper `X-Forwarded-*` headers. Default: true.
* `:preserve_encoding` Set to true to pass Accept-Encoding header to proxy server. Default: false.

### Sample usage in a Ruby on Rails app

Rails 3 or less:

```ruby
# config/application.rb
config.middleware.insert_before(Rack::Lock, Rack::ReverseProxy) do
  reverse_proxy_options preserve_host: true
  reverse_proxy '/wiki', 'http://wiki.example.com/'
end
```

Rails 4+ or if you use `config.threadsafe`, you'll need to `insert_before(Rack::Runtime, Rack::ReverseProxy)` as `Rack::Lock` does not exist when `config.allow_concurrency == true`:

```ruby
# config/application.rb
config.middleware.insert_before(Rack::Runtime, Rack::ReverseProxy) do
  reverse_proxy_options preserve_host: true
  reverse_proxy '/wiki', 'http://wiki.example.com/'
end
```

## Note on Patches/Pull Requests
* Fork the project.
* Make your feature addition or bug fix.
* Add tests for it. This is important so I don't break it in a
  future version unintentionally.
* Commit, do not mess with rakefile, version, or history.
  (if you want to have your own version, that is fine but bump version in a commit by itself I can ignore when I pull)
* Send me a pull request. Bonus points for topic branches.

## Contributors

- Jon Swope, creator
- Oleksii Fedorov, maintainer
