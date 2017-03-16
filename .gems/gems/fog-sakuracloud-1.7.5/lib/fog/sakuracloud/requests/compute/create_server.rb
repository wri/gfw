# coding: utf-8

module Fog
  module Compute
    class SakuraCloud
      class Real
        def create_server(options)
          if options[:switch]
            switchs = options[:switch].split(',')
            connectedswitches = switchs.map do |sw_id|
              {
                "ID" => sw_id
              }
            end
          else
            connectedswitches = [{"Scope"=>"shared", "BandWidthMbps"=>100}]
          end

          body = {
            "Server" => {
              "Name" => options[:name],
              "ServerPlan" => {
                "ID" => options[:serverplan].to_i
              },
              "ConnectedSwitches" => connectedswitches
            }
          }

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [201],
            :method => 'POST',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/server",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def create_server(options)
          response = Excon::Response.new
          response.status = 201
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Volume
end # Fog
