module Fog
  module Compute
    class Aliyun
      class Real
        def delete_snapshot(snapshotId)
          # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/snapshot&deletesnapshot]
          action = 'DeleteSnapshot'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)
          
          parameters["SnapshotId"] = snapshotId
          pathUrl += '&SnapshotId='
          pathUrl += snapshotId

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
