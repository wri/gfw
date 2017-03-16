#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/softlayer/compute/shared'

module Fog
  module Account
    class Softlayer < Fog::Service
      # Client credentials
      requires :softlayer_username, :softlayer_api_key

      model_path 'fog/softlayer/models/account'
      collection    :brands
      model         :brand

      request_path 'fog/softlayer/requests/account'
      request :create_brand
      request :get_account_owned_brands
      request :get_brand
      request :get_brand_owned_accounts

      # The Mock Service allows you to run a fake instance of the Service
      # which makes no real connections.
      #
      #
      class Mock
        include Fog::Softlayer::Compute::Shared

        def initialize(options={})
          @brands = []
          @accounts = [{'id' => 1}]
          super(options)
        end

        def credentials
          { :provider           => 'softlayer',
            :softlayer_username => @softlayer_username,
            :softlayer_api_key  => @softlayer_api_key
          }
        end
      end

      ##
      # Makes real connections to Softlayer.
      #
      class Real
        include Fog::Softlayer::Slapi
        include Fog::Softlayer::Compute::Shared

        def initialize(options={})
          @softlayer_api_key = options[:softlayer_api_key]
          @softlayer_username = options[:softlayer_username]
        end

        def request(service, path, options = {})
          options = {:username => @softlayer_username, :api_key => @softlayer_api_key}.merge(options)
          Fog::Softlayer::Slapi.slapi_request(service, path, options)
        end
      end
    end
  end
end
