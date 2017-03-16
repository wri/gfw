# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def delete_interface( id )
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'DELETE',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/interface/#{id}"
          )
        end
      end # Real

      class Mock
        def delete_interface( id )
          response = Excon::Response.new
          response.status = 200
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Network
end # Fog
