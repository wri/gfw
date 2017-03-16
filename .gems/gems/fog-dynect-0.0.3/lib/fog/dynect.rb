require 'nokogiri'

require 'fog/core'
require 'fog/json'
require 'fog/xml'

module Fog
  module DNS
    autoload :Dynect, File.expand_path('../dynect/dns', __FILE__)
  end

  module Dynect
    extend Fog::Provider

    autoload :VERSION, File.expand_path('../dynect/version', __FILE__)

    service(:dns, 'DNS')

    class Mock
      def self.job_id
        Fog::Mock.random_numbers(8).to_i
      end

      def self.token
        Fog::Mock.random_hex(48)
      end

      def self.version
        [Fog::Mock.random_numbers(1), Fog::Mock.random_numbers(1), Fog::Mock.random_numbers(1)].join('.')
      end
    end
  end
end
