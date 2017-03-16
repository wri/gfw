# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def create_switch(options)
          body = {
            "Switch" => {
              "Name" => options[:name]
            }
          }

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => 201,
            :method => 'POST',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/switch",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def create_switch(options)
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
