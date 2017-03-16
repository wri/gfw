module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/snapshot&describesnapshots]
        def list_snapshots(options={})
          
          action = 'DescribeSnapshots'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          pageNumber = options[:pageNumber]
          pageSize = options[:pageSize]
          instanceId = options[:instanceId]
          diskId = options[:diskId]
          snapshotId = options[:snapshotIds]
          sourceDiskType = options[:sourceDiskType]
          name = options[:snapshotName]
          state = options[:state]
          type = options[:snapshotType]
          usage = options[:usage]

          if usage
            parameters["Usage"] = usage
            pathUrl += '&Usage='
            pathUrl += usage
          end

          if type
            parameters["SnapshotType"] = type
            pathUrl += '&SnapshotType='
            pathUrl += type
          end

          if state
            parameters["Status"] = state
            pathUrl += '&Status='
            pathUrl += state
          end

          if name
            parameters["SnapshotName"] = name
            pathUrl += '&SnapshotName='
            pathUrl += name
          end

          if instanceId
            parameters["InstanceId"] = instanceId
            pathUrl += '&InstanceId='
            pathUrl += instanceId
          end

          if diskId
            parameters["DiskId"] = diskId
            pathUrl += '&DiskId='
            pathUrl += diskId
          end          

          if snapshotId
            parameters["SnapshotIds"] = Fog::JSON.encode(snapshotId)
            pathUrl += '&SnapshotIds='
            pathUrl += Fog::JSON.encode(snapshotId)
          end
          
          if sourceDiskType
            parameters["SourceDiskType"] = sourceDiskType
            pathUrl += '&SourceDiskType='
            pathUrl += sourceDiskType
          end
          
          if pageNumber
            parameters["PageNumber"] = pageNumber
            pathUrl += '&PageNumber='
            pathUrl += pageNumber
          end

          unless pageSize
            pageSize = '50'
          end
          parameters["PageSize"] = pageSize
          pathUrl += '&PageSize='
          pathUrl += pageSize	

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
