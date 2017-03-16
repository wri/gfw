# coding: utf-8

module Fog
  module DNS
    class SakuraCloud
      class Real
        def list_zones(options = {})
          filter = {
            "Filter" => {
              "Provider.Class" => "dns"
            }
          }
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/commonserviceitem",
            :query => URI.encode(Fog::JSON.encode(filter))
          )
        end
      end

      class Mock
        def list_zones(options = {})
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
