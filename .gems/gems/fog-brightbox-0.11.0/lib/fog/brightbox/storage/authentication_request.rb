module Fog
  module Brightbox
    module Storage
      class AuthenticationRequest
        attr_accessor :access_token, :management_url
        attr_accessor :user, :tenant

        def initialize(config)
          @config = config
        end

        def authenticate
          response = authentication_request

          self.access_token = response.headers["X-Auth-Token"]
          self.management_url = response.headers["X-Server-Management-Url"] || response.headers["X-Storage-Url"]
          self
        rescue Excon::Errors::Unauthorized => error
          raise Fog::Brightbox::Storage::AuthenticationRequired.slurp(error)
        end

        private

        def authentication_request
          authentication_url = URI.parse(@config.storage_url.to_s)
          connection = Fog::Core::Connection.new(authentication_url.to_s)
          request_settings = {
            :expects => [200, 204],
            :headers => auth_headers,
            :method => "GET",
            :path => "v1"
          }
          connection.request(request_settings)
        end

        def auth_headers
          if @config.user_credentials?
            {
              "X-Auth-User" => @config.username,
              "X-Auth-Key" => @config.password
            }
          else
            {
              "X-Auth-User" => @config.client_id,
              "X-Auth-Key" => @config.client_secret
            }
          end
        end
      end
    end
  end
end
