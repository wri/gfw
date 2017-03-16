module Fog
  module Volume
    class SakuraCloud < Fog::Service
      requires     :sakuracloud_api_token
      requires     :sakuracloud_api_token_secret

      recognizes   :sakuracloud_api_url, :api_zone

      model_path 'fog/sakuracloud/models/volume'
      model      :archive
      collection :archives
      model      :plan
      collection :plans
      model      :disk
      collection :disks

      request_path 'fog/sakuracloud/requests/volume'
      request      :list_disks
      request      :list_plans
      request      :create_disk
      request      :configure_disk
      request      :associate_ip_to_disk
      request      :register_note_to_disk
      request      :attach_disk
      request      :delete_disk
      request      :list_archives
      request      :carve_hostname_on_disk

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
              :disks => [],
              :plans => [],
              :archives => []
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
  end #Volume
end
