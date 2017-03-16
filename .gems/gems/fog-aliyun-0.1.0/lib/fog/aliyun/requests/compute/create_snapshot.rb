module Fog
  module Compute
    class Aliyun
      class Real
        def create_snapshot(diskId, options={})
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/snapshot&createsnapshot]          
          action = 'CreateSnapshot'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)
          
          parameters["DiskId"] = diskId
          pathUrl += '&DiskId='
          pathUrl += diskId

          name = options[:name]
          desc = options[:description]
          
          if name
            parameters["SnapshotName"] = name
            pathUrl += '&SnapshotName='
            pathUrl += name
          end

          if desc
            parameters["Description"] = desc
            pathUrl += '&Description='
            pathUrl += desc
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
        def list_images
          response = Excon::Response.new
          data = list_images_detail.body['images']
          images = []
          for image in data
            images << image.reject { |key, value| !['id', 'name', 'links'].include?(key) }
          end
          response.status = [200, 203][rand(1)]
          response.body = { 'images' => images }
          response
        end
      end
    end
  end
end
