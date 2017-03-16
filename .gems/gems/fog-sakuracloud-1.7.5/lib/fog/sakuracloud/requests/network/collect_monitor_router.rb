# coding: utf-8

module Fog
  module Network
    class SakuraCloud
      class Real
        def collect_monitor_router( id ,start_time = nil, end_time = nil)
          filter = {}
          filter['Start'] = start_time if start_time
          filter['End']   = end_time if end_time
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [200],
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/internet/#{id}/monitor",
            :query => URI.encode(Fog::JSON.encode(filter))
          )
        end
      end # Real

      class Mock
        def collect_monitor_router( id )
          response = Excon::Response.new
          response.status = 200
          response.body = {
            "Data"=>{
              "2015-12-16T18:00:00+09:00"=>{
                "In"=>500000,
                "Out"=>70000000
              }
            },
            "is_ok"=>true
          }
          response
        end
      end # Mock
    end # SakuraCloud
  end # Network
end # Fog
