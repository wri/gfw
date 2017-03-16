# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def list_routers(options = {})
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/internet"
          )
        end
      end

      class Mock
        def list_routers(options = {})
          response = Excon::Response.new
          response.status = 200
          response.body = {
            "Internet"=>[
              {"Index"=>0,
               "ID"=>"112600707538",
               "Switch"=>{
                 "ID"=>"112600707539",
                 "Name"=>"router2"
               }
            }
            ],
            "is_ok"=>true
          }
          response
        end
      end
    end
  end
end
