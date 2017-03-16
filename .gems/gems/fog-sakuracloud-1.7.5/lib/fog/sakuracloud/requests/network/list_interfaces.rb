# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def list_interfaces(options = {})
          filter = {
            "Include" => [
              "ID",
              "MACAddress",
              "IPAddress",
              "UserIPAddress",
              "Switch.ID",
              "Server.ID"]
          }
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/interface",
            :query => URI.encode(Fog::JSON.encode(filter))
          )
        end
      end

      class Mock
        def list_interfaces(options = {})
          response = Excon::Response.new
          response.status = 200
          response.body = {
          }
          response
        end
      end
    end
  end
end
