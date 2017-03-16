require "fog/core"
require "fog/xml"
require "builder"

require File.expand_path("../ecloud/version", __FILE__)
require File.expand_path("../ecloud/ipaddr", __FILE__)

module Fog
  module Compute
    autoload :Ecloud, File.expand_path("../compute/ecloud", __FILE__)
  end

  module Ecloud
    ECLOUD_OPTIONS = [:ecloud_authentication_method]

    autoload :MockDataClasses, File.expand_path("../ecloud/mock_data_classes", __FILE__)

    extend Fog::Provider

    service(:compute, "Compute")

    def self.keep(hash, *keys)
      {}.tap do |kept|
        keys.each{ |k| kept[k] = hash[k] if hash.key?(k) }
      end
    end

    def self.slice(hash, *keys)
      hash.dup.tap do |sliced|
        keys.each{ |k| sliced.delete(k) }
      end
    end

    def self.ip_address
      4.times.map { Fog::Mock.random_numbers(3) }.join(".")
    end

    def self.mac_address
      6.times.map { Fog::Mock.random_numbers(2) }.join(":")
    end
  end
end
