# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require 'rack/reverse_proxy'

use Rack::Deflater
use Rack::ReverseProxy do
  # Set :preserve_host to true globally (default is true already)
  reverse_proxy_options preserve_host: true

  # Forward the path /gfw-assets* to ENV['GFW_ASSETS_URL']*
  reverse_proxy(/^\/gfw-assets\/?(.*)$/, "#{ENV['GFW_ASSETS_URL']}$1")

  # Forward the path /howto/* to ENV['GFW_HOWTO_URL']/*
  reverse_proxy(/^\/howto(\/.*)$/, "#{ENV['GFW_HOWTO_URL']}$1")

  # Forward the path /howto/* to ENV['GFW_HOWTO_URL']/*
  reverse_proxy(/^\/developers-corner(\/.*)$/, "#{ENV['GFW_DEVELOPERS_URL']}$1")

end

if ENV['ACCESS'] == 'private'
  use Rack::Auth::Basic, "Restricted Area" do |username, password|
    username == ENV['ACCESS_USER']
    password  == ENV['ACCESS_PASSWORD']
  end
end

run Rails.application
