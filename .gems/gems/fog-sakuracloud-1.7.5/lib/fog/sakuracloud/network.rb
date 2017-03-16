module Fog
  module Network
    class SakuraCloud < Fog::Service
      requires     :sakuracloud_api_token
      requires     :sakuracloud_api_token_secret

      recognizes   :sakuracloud_api_url, :api_zone

      model_path 'fog/sakuracloud/models/network'
      model      :router
      collection :routers
      model      :switch
      collection :switches
      model      :interface
      collection :interfaces

      request_path 'fog/sakuracloud/requests/network'
      request      :list_routers
      request      :create_router
      request      :delete_router
      request      :collect_monitor_router
      request      :change_router_bandwidth
      request      :list_switches
      request      :create_switch
      request      :delete_switch
      request      :list_interfaces
      request      :regist_interface_to_server
      request      :connect_interface_to_switch
      request      :delete_interface

      class Real
        include Fog::SakuraCloud::Utils::Request

        def initialize(options = {})
          @auth_encode = Base64.strict_encode64([
            options[:sakuracloud_api_token],
            options[:sakuracloud_api_token_secret]
          ].join(':'))
          Fog.credentials[:sakuracloud_api_token]        = options[:sakuracloud_api_token]
          Fog.credentials[:sakuracloud_api_token_secret] = options[:sakuracloud_api_token_secret]

          @sakuracloud_api_url = options[:sakuracloud_api_url] || 'https://secure.sakura.ad.jp'
          @api_zone            = options[:api_zone] || Fog.credentials[:sakuracloud_api_zone] || 'is1b'
          Fog::SakuraCloud.validate_api_zone!(@api_zone)

          @connection = Fog::Core::Connection.new(@sakuracloud_api_url)
        end
      end

      class Mock
        def self.data
          @data ||= Hash.new do |hash, key|
            hash[key] = {
              :routers => []
            }
          end
        end

        def self.reset
          @data = nil
        end

        def initialize(options={})
          @sakuracloud_api_token        = options[:sakuracloud_api_token]
          @sakuracloud_api_token_secret = options[:sakuracloud_api_token_secret]
        end

        def data
          self.class.data[@sakuracloud_api_token]
          self.class.data[@sakuracloud_api_token_secret]
        end

        def reset_data
          self.class.data.delete(@sakuracloud_api_token)
          self.class.data.delete(@sakuracloud_api_token_secret)
        end
      end
    end #SakuraCloud
  end #Network
end
