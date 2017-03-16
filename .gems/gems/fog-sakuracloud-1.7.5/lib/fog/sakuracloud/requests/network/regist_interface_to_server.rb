# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def regist_interface_to_server( server_id )
          body = {
            "Interface" => {
              "Server" => {
                "ID" => server_id
              }
            }
          }

          response = request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [201],
            :method => 'POST',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/interface",
            :body => Fog::JSON.encode(body)
          )
          response.body['Interface']['ID']
        end
      end # Real

      class Mock
        def regist_interface_to_server( id )
          response = Excon::Response.new
          response.status = 201
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Network
end # Fog
