# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def connect_interface_to_switch( id, switch_id )
          response = request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'PUT',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/interface/#{id}/to/switch/#{switch_id}"
          )
          response.body['Interface']['ID']
        end
      end # Real

      class Mock
        def regist_interface_to_server( id, switch_id )
          response = Excon::Response.new
          response.status = 20
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Network0
end # Fog
