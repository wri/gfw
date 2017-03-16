# coding: utf-8

module Fog
  module Volume
    class SakuraCloud
      class Real
        def register_note_to_disk( disk_id, notes )
          body = {
            "Notes" => notes.map {|note| { "ID" => note }}
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
        def register_note_to_disk( disk_id, notes )
          response = Excon::Response.new
          response.status = 200
          response.body = {
          }
          response
        end
      end
    end
  end
end
