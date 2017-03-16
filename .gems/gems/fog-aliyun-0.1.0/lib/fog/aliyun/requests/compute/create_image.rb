module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.201.106.DGkmH7#/pub/ecs/open-api/image&createimage]
        def create_image(snapshotId, options={})
          action = 'CreateImage'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          parameters["SnapshotId"] = snapshotId
          pathUrl += '&SnapshotId='
          pathUrl += snapshotId	
         
          name = options[:name]
          if name
            parameters["ImageName"] = name
            pathUrl += '&ImageName='
            pathUrl += name	
          end
          
          desc = options[:description]
          if desc
            parameters["Description"] = desc
            pathUrl += '&Description='
            pathUrl += desc
          end
          
          version = options[:version]
          if version
            parameters["ImageVersion"] = version
            pathUrl += '&ImageVersion='
            pathUrl += version
          end

          signature = sign(@aliyun_accesskey_secret, parameters)
          pathUrl += '&Signature='
          pathUrl += signature

          request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => pathUrl
          )
        end
      end

      class Mock
        def create_image(server_id, name, metadata={})
          response = Excon::Response.new
          response.status = 202

          img_id=Fog::Mock.random_numbers(6).to_s

          data = {
            'id'        => img_id,
            'server'     => {"id"=>"3", "links"=>[{"href"=>"http://nova1:8774/admin/servers/#{server_id}", "rel"=>"bookmark"}]},
            'links'     => [{"href"=>"http://nova1:8774/v1.1/admin/images/#{img_id}", "rel"=>"self"}, {"href"=>"http://nova1:8774/admin/images/#{img_id}", "rel"=>"bookmark"}],
            'metadata'  => metadata || {},
            'name'      => name || "server_#{rand(999)}",
            'progress'  => 0,
            'status'    => 'SAVING',
            'minDisk'   => 0,
            'minRam'    => 0,
            'updated'   => "",
            'created'   => ""
          }
          self.data[:last_modified][:images][data['id']] = Time.now
          self.data[:images][data['id']] = data
          response.body = { 'image' => data }
          response
        end
      end
    end
  end
end
