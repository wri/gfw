module Fog
  module Brightbox
    module Storage
      class Connection < Fog::Core::Connection
        def initialize(config)
          @config = config

          if management_url
            @connection = super(management_url.to_s, persistent?, connection_options)
          else
            raise ManagementUrlUnknown
          end
        end

        def request(params, parse_json = true)
          begin
            raise ArgumentError if params.nil?
            request_params = params.merge(
              :headers => request_headers(params),
              :path => path_in_params(params)
            )
            response = @connection.request(request_params)
          rescue Excon::Errors::Unauthorized => error
            raise AuthenticationRequired.slurp(error)
          rescue Excon::Errors::NotFound => error
            raise Fog::Storage::Brightbox::NotFound.slurp(error)
          rescue Excon::Errors::HTTPStatusError => error
            raise error
          end

          if !response.body.empty? && parse_json && response.get_header("Content-Type") =~ %r{application/json}
            response.body = Fog::JSON.decode(response.body)
          end
          response
        end

        def management_url
          @config.storage_management_url
        end

        def path_in_params(params)
          if params.respond_to?(:key?) && params.key?(:path)
            URI.join(@config.storage_management_url.to_s + "/", params[:path]).path
          else
            @config.storage_management_url.path
          end
        end

        def request_headers(excon_params)
          if excon_params.respond_to?(:key?) && excon_params.key?(:headers)
            authenticated_headers.merge(excon_params[:headers])
          else
            authenticated_headers
          end
        end

        def authenticated_headers
          default_headers.merge(
            "X-Auth-Token" => @config.latest_access_token
          )
        end

        def default_headers
          {
            "Content-Type" => "application/json",
            "Accept" => "application/json"
          }
        end

        def persistent?
          @config.connection_persistent?
        end

        def connection_options
          @config.storage_connection_options
        end
      end
    end
  end
end
