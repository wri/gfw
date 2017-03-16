module Fog
  module Compute
    class Aliyun
      class Real
        # Describe disks.
        #
        # ==== Parameters
        # * options<~hash>
        #     * :diskIds - arry of diskId, the length of arry should less than or equal to 100.
        #     * :instanceId - id of the instance
        #     * :diskType - Default 'all'.Can be set to all | system | data
        #     * :category - Default 'all'. Can be set to all | cloud | cloud_efficiency | cloud_ssd | ephemeral | ephemeral_ssd
        #     * :state - status of the disk. Default 'All'. Can be set to In_use | Available | Attaching | Detaching | Creating | ReIniting | All
        #     * :snapshotId - id of snapshot which used to create disk.
        #     * :name - name of disk
        #     * :portable - If ture, can exist dependently,which means it can be mount or umont in available zones.
        #           Else, it must be created or destroyed with a instance. 
        #           The value for ocal disks and system disks on the cloud and cloud disks paid by month must be false.
        #     * :delWithIns - If ture, the disk will be released when the instance is released.
        #     * :delAutoSna - If ture, the auto created snapshot will be destroyed when the disk is destroyed
        #     * :enAutoSna - Whether the disk apply the auto snapshot strategy.
        #     * :diskChargeType - Prepaid | Postpaid
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'RequestId'<~String> - Id of the request
        #     * 'Disks'<~Hash> - list of Disk,and the parameter of disk refer to the Volume model
        #
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/disk&describedisks]
        def list_disks(options={})
          action = 'DescribeDisks'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          pageNumber = options[:pageNumber]
          pageSize   = options[:pageSize]
          instanceId = options[:instanceId]
          diskIds = options[:diskIds]
          diskType = options[:diskType]
          category = options[:category]
          state = options[:state]
          snapshotId = options[:snapshotId]
          name = options[:name]
          portable = options[:portable]
          delWithIns = options[:deleteWithInstance]
          delAutoSna = options[:deleteAutoSnapshot]
          enAutoSna = options[:enableAutoSnapshot]
          diskChargeType = options[:diskChargeType]

          if diskChargeType
            parameters["DiskChargeType"] = diskChargeType
            pathUrl += '&DiskChargeType='
            pathUrl += diskChargeType
          end

          if enAutoSna
            parameters["EnableAutoSnapshot"] = enAutoSna
            pathUrl += '&EnableAutoSnapshot='
            pathUrl += enAutoSna
          end

          if delAutoSna
            parameters["DeleteAutoSnapshot"] = delAutoSna
            pathUrl += '&DeleteAutoSnapshot='
            pathUrl += delAutoSna
          end

          if delWithIns
            parameters["DeleteWithInstance"] = delWithIns
            pathUrl += '&DeleteWithInstance='
            pathUrl += delWithIns
          end

          if portable
            parameters["Portable"] = portable
            pathUrl += '&Portable='
            pathUrl += portable
          end

          if name
            parameters["DiskName"] = name
            pathUrl += '&DiskName='
            pathUrl += name
          end

          if snapshotId
            parameters["SnapshotId"] = snapshotId
            pathUrl += '&SnapshotId='
            pathUrl += snapshotId
          end

          if state
            parameters["Status"] = state
            pathUrl += '&Status='
            pathUrl += state
          end

          if category
            parameters["DiskType"] = diskType
            pathUrl += '&DiskType='
            pathUrl += diskType
          end

          if category
            parameters["Category"] = category
            pathUrl += '&Category='
            pathUrl += category
          end

          if instanceId
            parameters["InstanceId"] = instanceId
            pathUrl += '&InstanceId='
            pathUrl += instanceId
          end

          if diskIds
            parameters["DiskIds"] = Fog::JSON.encode(diskIds)
            pathUrl += '&DiskIds='
            pathUrl += Fog::JSON.encode(diskIds)
          end
          
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
        def list_zones(*args)
          Excon::Response.new(
            :body   => { "availabilityZoneInfo" => [
                  {
                      "zoneState" => {
                          "available" => true
                      },
                      "hosts" => nil,
                      "zoneName" => "nova"
                  }
              ] },
            :status => 200
          )
        end
      end
    end
  end
end
