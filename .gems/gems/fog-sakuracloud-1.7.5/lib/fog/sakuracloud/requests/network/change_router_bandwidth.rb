# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def change_router_bandwidth( id, bandwidthmbps )
          body = {
            "Internet" => {
              "BandWidthMbps" => bandwidthmbps
            }
          }

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'PUT',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/internet/#{id}/bandwidth",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def change_router_bandwidth( id, bandwidthmbps )
          response = Excon::Response.new
          response.status = 200
          response.body = {
            "Internet"=>{"ID"=>"112701091977"},
            "Success"=>true,
            "is_ok"=>true
          }
          response
        end
      end # Mock
    end # SakuraCloud
  end # Network
end # Fog
