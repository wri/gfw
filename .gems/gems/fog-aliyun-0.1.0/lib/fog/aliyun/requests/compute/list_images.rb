module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/image&describeimages]
        def list_images(options={})
          
          action = 'DescribeImages'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          pageNumber = options[:pageNumber]
          if pageNumber
            parameters["PageNumber"] = pageNumber
            pathUrl += '&PageNumber='
            pathUrl += pageNumber
          end

          pageSize   = options[:pageSize]
          unless pageSize
            pageSize = '50'
          end
          parameters["PageSize"] = pageSize  
          pathUrl += '&PageSize='
          pathUrl += pageSize	
          
          imageId = options[:imageId]
          if imageId
            parameters["ImageId"] = imageId
            pathUrl += '&ImageId='
            pathUrl += imageId	
          end
          
          imageName = options[:imageName]
          if imageName
            parameters["ImageName"] = imageName
            pathUrl += '&ImageName='
            pathUrl += imageName
          end
          
          snapshotId = options[:snapshotId]
          if snapshotId
            parameters["SnapshotId"] = snapshotId
            pathUrl += '&SnapshotId='
            pathUrl += snapshotId
          end
          
          ownerAlias = options[:ownerAlias]
          if ownerAlias
            parameters["ImageOwnerAlias"] = ownerAlias
            pathUrl += '&ImageOwnerAlias='
            pathUrl += ownerAlias
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
