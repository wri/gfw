require 'fog/core'
require 'fog/json'
require 'fog/sakuracloud/utils/request'

module Fog
  module Compute
    autoload :SakuraCloud, File.expand_path('../sakuracloud/compute', __FILE__)
  end

  module Network
    autoload :SakuraCloud, File.expand_path('../sakuracloud/network', __FILE__)
  end

  module Volume
    autoload :SakuraCloud, File.expand_path('../sakuracloud/volume', __FILE__)
  end

  module DNS
    autoload :SakuraCloud, File.expand_path('../sakuracloud/dns', __FILE__)
  end

  module SakuraCloud
    extend Fog::Provider

    SAKURACLOUD_API_VERSION = '1.1' unless defined? SAKURACLOUD_API_VERSION

    # Miscs
    ## Startup Script
    autoload :Script,      File.expand_path('../sakuracloud/script', __FILE__)

    service(:compute, 'Compute')
    service(:volume,  'Volume')
    service(:network, 'Network')
    service(:script,  'Script')
    service(:dns,     'DNS')


    def self.api_zones
      @api_zones ||= ['tk1a','is1a', 'is1b', 'tk1v']
    end

    def self.validate_api_zone!(api_zone, host=nil)
      if !api_zones.include?(api_zone)
        raise ArgumentError, "Unknown api_zone: #{api_zone.inspect}"
      end
    end

    def self.build_endpoint(api_zone)
      "/cloud/zone/#{api_zone}/api/cloud/#{SAKURACLOUD_API_VERSION}/"
    end
  end
end
