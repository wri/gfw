module Fog
  module Storage
    class Brightbox < Fog::Service
      requires :brightbox_client_id,
               :brightbox_secret
      recognizes :persistent, :brightbox_service_name,
                 :brightbox_storage_url,
                 :brightbox_service_type, :brightbox_tenant,
                 :brightbox_region, :brightbox_temp_url_key

      model_path "fog/brightbox/models/storage"
      model :directory
      collection :directories
      model :file
      collection :files

      request_path "fog/brightbox/requests/storage"
      request :copy_object
      request :delete_container
      request :delete_object
      request :delete_multiple_objects
      request :delete_static_large_object
      request :get_container
      request :get_containers
      request :get_object
      request :get_object_http_url
      request :get_object_https_url
      request :head_container
      request :head_containers
      request :head_object
      request :post_set_meta_temp_url_key
      request :put_container
      request :put_dynamic_obj_manifest
      request :put_object
      request :put_object_manifest
      request :put_static_obj_manifest

      class Mock
        def initialize(_options = {})
        end
      end

      class Real
        def initialize(config)
          if config.respond_to?(:config_service?) && config.config_service?
            @config = config
          else
            @config = Fog::Brightbox::Config.new(config)
          end
          @config = Fog::Brightbox::Storage::Config.new(@config)

          @temp_url_key = @config.storage_temp_key
        end

        def needs_to_authenticate?
          @config.must_authenticate?
        end

        def authentication_url
          @auth_url ||= URI.parse(@config.storage_url.to_s)
        end

        def management_url
          @config.storage_management_url
        end

        def reload
          @connection.reset
        end

        def account
          @config.account
        end

        def change_account(account)
          @config.change_account(account)
        end

        def reset_account_name
          @config.reset_account
        end

        def connection
          @connection ||= Fog::Brightbox::Storage::Connection.new(@config)
        end

        def request(params, parse_json = true)
          authenticate if @config.must_authenticate?
          connection.request(params, parse_json)
        rescue Fog::Brightbox::Storage::AuthenticationRequired => error
          if @config.managed_tokens?
            @config.expire_tokens!
            authenticate
            retry
          else # bad credentials
            raise error
          end
        rescue Excon::Errors::HTTPStatusError => error
          raise case error
                when Excon::Errors::NotFound
                  Fog::Storage::Brightbox::NotFound.slurp(error)
                else
                  error
                end
        end

        def authenticate
          if !management_url || needs_to_authenticate?
            response = Fog::Brightbox::Storage::AuthenticationRequest.new(@config).authenticate
            if response.nil?
              return false
            else
              update_config_from_auth_response(response)
            end
          else
            false
          end
        end

        # @param [URI] url A URI object to extract the account from
        # @return [String] The account
        def extract_account_from_url(url)
          url.path.split("/")[2]
        end

        private

        def update_config_from_auth_response(response)
          @config.update_tokens(response.access_token)

          # Only update the management URL if not set
          return true if management_url && account

          unless management_url
            new_management_url = response.management_url
            if new_management_url && new_management_url != management_url.to_s
              @config.storage_management_url = URI.parse(new_management_url)
            end
          end

          unless account
            # Extract the account ID sent by the server
            change_account(extract_account_from_url(@config.storage_management_url))
          end
          true
        end
      end

      # CGI.escape, but without special treatment on spaces
      def self.escape(str, extra_exclude_chars = "")
        str.gsub(/([^a-zA-Z0-9_.-#{extra_exclude_chars}]+)/) do
          "%" + Regexp.last_match[1].unpack("H2" * Regexp.last_match[1].bytesize).join("%").upcase
        end
      end
    end
  end
end
