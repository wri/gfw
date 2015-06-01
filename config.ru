# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
use Rack::Deflater
run Rails.application

require 'rack/reverse_proxy'

use Rack::ReverseProxy do
  # Set :preserve_host to true globally (default is true already)
  reverse_proxy_options preserve_host: true

  # Forward the path /test* to http://example.com/test*
  reverse_proxy /^\/gfw-assets\/?(.*)$/, "#{ENV['GFW_ASSETS_URL']}$1"

end
