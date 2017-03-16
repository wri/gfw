# coding: utf-8

module Fog
  module Volume
    class SakuraCloud
      class Real
        def configure_disk( disk_id, sshkey_id )
          body = {
            "SSHKey" => {"ID" => sshkey_id.to_s }
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
        def configure_disk( disk_id, sshkey_id )
          response = Excon::Response.new
          response.status = 200
          response.body = {"Success"=>true, "is_ok"=>true}
          response
        end
      end
    end # SakuraCloud
  end # Volume
end # Fog
