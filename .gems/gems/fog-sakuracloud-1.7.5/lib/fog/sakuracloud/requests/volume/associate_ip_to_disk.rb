# coding: utf-8

module Fog
  module Volume
    class SakuraCloud
      class Real
        def associate_ip_to_disk( disk_id, subnet )
          body = {
            "UserIPAddress" => subnet[:ipaddress],
            "UserSubnet" => {
              "NetworkMaskLen" => subnet[:networkmasklen],
              "DefaultRoute" => subnet[:defaultroute]
            }
          }

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'PUT',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/disk/#{disk_id.to_s}/config",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def associate_ip_to_disk( disk_id, subnet )
          response = Excon::Response.new
          response.status = 200
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Volume
end # Fog
