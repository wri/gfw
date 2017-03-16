module Fog
  module Openstack
    VERSION = "0.1.20"

    def self.included(base)
      if RUBY_VERSION < "2"
        puts "DEPRECATION WARNING - Support for Ruby 1.9 will be dropped in fog-openstack 0.2 and higher. Please upgrade to Ruby 2 or above."
      end
    end
  end
end
