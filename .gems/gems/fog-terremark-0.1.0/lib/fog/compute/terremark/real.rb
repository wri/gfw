module Fog
  module Compute
    class Terremark
      # documentation stub
      class Real
        include Common

        def initialize(options = {})
          @terremark_username     = options[:terremark_vcloud_username]
          @terremark_password     = options[:terremark_vcloud_password]
        end

        private

        def auth_token
          response = @connection.request(
              :expects   => 200,
              :headers   => auth_headers,
              :host      => @host,
              :method    => "POST",
              :parser    => Fog::Parsers::Terremark::GetOrganizations.new,
              :path      => "#{@path}/login"
          )
          response.headers["Set-Cookie"]
        end

        def auth_headers
          credentials = "#{@terremark_username}:#{@terremark_password}"
          encoded_credentials = Base64.encode64(credentials)
          # remove newlines because strict_encode64 is not compatible with 1.8
          encoded_credentials = encoded_credentials.gsub(/\n/, "")
          {
            "Authorization" => "Basic #{encoded_credentials}",
            # Terremark said they're going to remove passing in the
            # Content-Type to login in a future release
            "Content-Type"  => "application/vnd.vmware.vcloud.orgList+xml"
          }
        end

        def reload
          @connection.reset
        end

        def request(params)
          @cookie ||= auth_token
          begin
            do_request(params)
          rescue Excon::Errors::Unauthorized
            @cookie = auth_token
            do_request(params)
          end
        end

        def do_request(params)
          @connection.request(
            :body     => params[:body],
            :expects  => params[:expects],
            :headers  => make_headers(params),
            :host     => @host,
            :method   => params[:method],
            :parser   => params[:parser],
            :path     => make_path(params)
          )
        end

        def make_headers(params)
          headers = {}
          headers.merge!("Cookie" => @cookie) if @cookie
          headers.merge!(params[:headers] || {})
        end

        def make_path(params)
          if params[:path]
            if params[:override_path] == true
              params[:path]
            else
              "#{@path}/#{params[:path]}"
            end
          else
            "#{@path}"
          end
        end
      end
    end
  end
end
