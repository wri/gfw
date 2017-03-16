require "rack_reverse_proxy"

# Re-opening Rack module only to define ReverseProxy constant
module Rack
  ReverseProxy = RackReverseProxy::Middleware
end
