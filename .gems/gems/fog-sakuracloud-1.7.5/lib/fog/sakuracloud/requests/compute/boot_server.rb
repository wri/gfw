# coding: utf-8

module Fog
  module Compute
    class SakuraCloud
      class Real
        def boot_server( id )
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'PUT',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/server/#{id}/power"
          )
          true
        end
      end # Real

      class Mock
        def boot_server( id )
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
