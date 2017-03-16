module Fog
  module Compute
    class Aliyun
      class Real
        # Create a disk with assigned size.
        #
        # ==== Parameters
        # * size<~String> - the size of the disk (GB).--cloud:5~2000GB,cloud_efficiency: 20~2048GB,cloud_ssd:20~1024GB
        # * options<~hash>
        #     * :name - The name of the disk,default nil. If not nil, it must start with english or chinise character. 
        #          The length should be within [2,128]. It can contain digits,'.','_' or '-'.It shouldn't start with 'http://' or 'https://'
        #     * :description - The name of the disk,default nil. If not nil, the length should be within [2,255].It shouldn't start with 'http://' or 'https://'
        #     * :category - Default 'cloud'. can be set to 'cloud','cloud_efficiency' or 'cloud_ssd'
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'RequestId'<~String> - Id of the request
        #     * 'DiskId'<~String> - Id of the created disk
        #
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.201.106.DGkmH7#/pub/ecs/open-api/disk&createdisk]
        def create_disk(size, options={})

          action   = 'CreateDisk'
          sigNonce = randonStr()
          time     = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          parameters["ZoneId"] = @aliyun_zone_id
          pathUrl += '&ZoneId='
          pathUrl += @aliyun_zone_id	
          
          parameters["Size"] = size
          pathUrl += '&Size='
          pathUrl += size	

          name  = options[:name]
          desc  = options[:description]
          category = options[:category]


          if name
            parameters["DiskName"] = name
            pathUrl += '&DiskName='
            pathUrl += name	
          end

          if desc
            parameters["Description"] = desc
            pathUrl += '&Description='
            pathUrl += desc	
          end

          if category
            parameters["DiskCategory"] = category
            pathUrl += 'DiskCategory'
            pathUrl += category
          end

          signature = sign(@aliyun_accesskey_secret, parameters)
          pathUrl += '&Signature='
          pathUrl += signature

          request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => pathUrl
          ).merge(options)
        end
        # Create a disk By the snapshot with given snapshot_id.
        #
        # ==== Parameters
        # * snapshotId<~String> - the snapshot_id
        # * options<~hash>
        #     * :name - The name of the disk,default nil. If not nil, it must start with english or chinise character. 
        #          The length should be within [2,128]. It can contain digits,'.','_' or '-'.It shouldn't start with 'http://' or 'https://'
        #     * :description - The name of the disk,default nil. If not nil, the length should be within [2,255].It shouldn't start with 'http://' or 'https://'
        #     * :category - Default 'cloud'. can be set to 'cloud','cloud_efficiency' or 'cloud_ssd'
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'RequestId'<~String> - Id of the request
        #     * 'DiskId'<~String> - Id of the created disk
        #
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.201.106.DGkmH7#/pub/ecs/open-api/disk&createdisk]
        def create_disk_by_snapshot(snapshotId, options={})

          action   = 'CreateDisk'
          sigNonce = randonStr()
          time     = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          parameters["ZoneId"] = @aliyun_zone_id
          pathUrl += '&ZoneId='
          pathUrl += @aliyun_zone_id  
          
          parameters["SnapshotId"] = snapshotId
          pathUrl += '&SnapshotId='
          pathUrl += snapshotId 

          name  = options[:name]
          desc  = options[:description]
          category = options[:category]

          if name
            parameters["DiskName"] = name
            pathUrl += '&DiskName='
            pathUrl += name 
          end

          if desc
            parameters["Description"] = desc
            pathUrl += '&Description='
            pathUrl += desc 
          end

          if category
            parameters["DiskCategory"] = category
            pathUrl += 'DiskCategory'
            pathUrl += category
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
        def create_security_group(name, description)
          Fog::Identity::OpenStack.new(:openstack_auth_url => credentials[:openstack_auth_url])
          tenant_id = Fog::Identity::OpenStack::V2::Mock.data[current_tenant][:tenants].keys.first
          security_group_id = Fog::Mock.random_numbers(2).to_i + 1
          self.data[:security_groups][security_group_id.to_s] = {
            'tenant_id' => tenant_id,
            'rules'     => [],
            'id'        => security_group_id,
            'name'      => name,
            'description' => description
          }

          response = Excon::Response.new
          response.status = 200
          response.headers = {
            'X-Compute-Request-Id' => "req-#{Fog::Mock.random_hex(32)}",
            'Content-Type'   => 'application/json',
            'Content-Length' => Fog::Mock.random_numbers(3).to_s,
            'Date'           => Date.new}
          response.body = {
            'security_group' => self.data[:security_groups][security_group_id.to_s]
          }
          response
        end
      end # mock
    end # aliyun
  end # compute
end # fog
