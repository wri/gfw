require 'fog/powerdns/version'
require 'fog/core'
require 'fog/xml'

module Fog
  module PowerDNS
    extend Fog::Provider

    service(:dns, 'DNS')
  end
end
