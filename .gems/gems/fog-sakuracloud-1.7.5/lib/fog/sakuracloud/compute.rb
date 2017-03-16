module Fog
  module Compute
    class SakuraCloud < Fog::Service
      requires     :sakuracloud_api_token
      requires     :sakuracloud_api_token_secret

      recognizes   :sakuracloud_api_url, :api_zone

      model_path 'fog/sakuracloud/models/compute'
      model      :server
      collection :servers
      model      :plan
      collection :plans
      model      :ssh_key
      collection :ssh_keys
      model      :zone
      collection :zones

      request_path 'fog/sakuracloud/requests/compute'
      request      :list_servers
      request      :create_server
      request      :delete_server
      request      :boot_server
      request      :stop_server
      request      :list_plans
      request      :list_ssh_keys
      request      :list_zones

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
        def initialize(options = {})
        end
      end
    end #SakuraCloud
  end #Compute
end
