# coding: utf-8

module Fog
  module Volume
    class SakuraCloud
      class Real
        def create_disk( name, plan, options = {} )
          body = { "Disk" => { "Name" => name, "Plan" => { "ID" => plan.to_i } } }

          if !options[:source_archive].nil?
            body["Disk"]["SourceArchive"] = { "ID"=>options[:source_archive].to_s }
          end

          if !options[:size_mb].nil?
            body["Disk"]["SizeMB"] = options[:size_mb].to_i
          end

          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :expects  => [201, 202],
            :method => 'POST',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/disk",
            :body => Fog::JSON.encode(body)
          )
        end
      end # Real

      class Mock
        def create_disk( name, plan, options = {} )
          response = Excon::Response.new
          response.status = 202
          response.body = {
          }
          response
        end
      end
    end # SakuraCloud
  end # Volume
end # Fog
