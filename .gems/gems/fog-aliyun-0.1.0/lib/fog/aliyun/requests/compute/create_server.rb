module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/instance&createinstance]
        def create_server(imageId, securityGroupId, instanceType, options = {})
          
          _action = 'CreateInstance'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)

          _parameters['ImageId'] = imageId
          _pathURL += '&ImageId='+imageId

          _parameters['InstanceType'] = instanceType
          _pathURL += '&InstanceType='+instanceType
          
          _parameters['SecurityGroupId'] = securityGroupId
          _pathURL += '&SecurityGroupId='+securityGroupId
          
          _ZoneId = options[:ZoneId]
          if _ZoneId
            _parameters['ZoneId']=_ZoneId
            _pathURL += '&ZoneId='+_ZoneId
          end

          _InstanceName = options[:InstanceName]
          if _InstanceName
            _parameters['InstanceName']=_InstanceName
            _pathURL += '&InstanceName='+_InstanceName
          end
          
          _Description = options[:Description]
          if _Description
            _parameters['Description']=_Description
            _pathURL += '&Description='+_Description
          end
          
          _InternetChargeType = options[:InternetChargeType]
          if _InternetChargeType
            _parameters['InternetChargeType']=_InternetChargeType
            _pathURL += '&InternetChargeType='+_InternetChargeType
          end
          
          _HostName = options[:HostName]
          if _HostName
            _parameters['HostName']=_HostName
            _pathURL += '&HostName='+_HostName
          end
          
          _Password = options[:Password]
          if _Password
            _parameters['Password']=_Password
            _pathURL += '&Password='+_Password
          end
          
          _VSwitchId = options[:VSwitchId]
          _PrivateIpAddress= options[:PrivateIpAddress]
          if _VSwitchId
            _parameters['VSwitchId']=_VSwitchId
            _pathURL += '&VSwitchId='+_VSwitchId

            if _PrivateIpAddress
              _parameters['PrivateIpAddress']=_PrivateIpAddress
              _pathURL += '&PrivateIpAddress='+_PrivateIpAddress
            end
          else

            _InternetMaxBandwidthIn = options[:InternetMaxBandwidthIn]
            if _InternetMaxBandwidthIn
              _parameters['InternetMaxBandwidthIn']=_InternetMaxBandwidthIn
              _pathURL += '&InternetMaxBandwidthIn='+_InternetMaxBandwidthIn
            end
          
            _InternetMaxBandwidthOut = options[:InternetMaxBandwidthOut]
            if _InternetMaxBandwidthOut
              _parameters['InternetMaxBandwidthOut']=_InternetMaxBandwidthOut
              _pathURL += '&InternetMaxBandwidthOut='+_InternetMaxBandwidthOut
            end
          end

          _signature = sign(@aliyun_accesskey_secret, _parameters)
          _pathURL += '&Signature='+_signature

          request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => _pathURL
          )
          
        end
      end

      class Mock
        def create_server(name, image_ref, flavor_ref, options = {})
          response = Excon::Response.new
          response.status = 202

          server_id = Fog::Mock.random_numbers(6).to_s
          identity = Fog::Identity::OpenStack.new :openstack_auth_url => credentials[:openstack_auth_url]
          user = identity.users.find { |u|
            u.name == @openstack_username
          }

          user_id = if user then
                      user.id
                    else
                       response = identity.create_user(@openstack_username,
                         'password',
                         "#{@openstack_username}@example.com")
                       response.body["user"]["id"]
                    end

          mock_data = {
            'addresses'    => {"Private" => [{"addr" => Fog::Mock.random_ip }]},
            'flavor'       => {"id" => flavor_ref, "links"=>[{"href"=>"http://nova1:8774/admin/flavors/1", "rel"=>"bookmark"}]},
            'id'           => server_id,
            'image'        => {"id" => image_ref, "links"=>[{"href"=>"http://nova1:8774/admin/images/#{image_ref}", "rel"=>"bookmark"}]},
            'links'        => [{"href"=>"http://nova1:8774/v1.1/admin/servers/5", "rel"=>"self"}, {"href"=>"http://nova1:8774/admin/servers/5", "rel"=>"bookmark"}],
            'hostId'       => "123456789ABCDEF01234567890ABCDEF",
            'metadata'     => options['metadata'] || {},
            'name'         => name || "server_#{rand(999)}",
            'accessIPv4'   => options['accessIPv4'] || "",
            'accessIPv6'   => options['accessIPv6'] || "",
            'progress'     => 0,
            'status'       => 'BUILD',
            'created'      => '2012-09-27T00:04:18Z',
            'updated'      => '2012-09-27T00:04:27Z',
            'user_id'      => @openstack_username,
            'config_drive' => options['config_drive'] || '',
          }

          if nics = options['nics']
            nics.each do |nic|
              mock_data["addresses"].merge!(
                "Public" => [{ 'addr' => Fog::Mock.random_ip }]
              )
            end
          end

          response_data = {}
          if options['return_reservation_id'] == 'True' then
            response_data = { 'reservation_id' => "r-#{Fog::Mock.random_numbers(6).to_s}" }
          else
            response_data = {
              'adminPass'       => 'password',
              'id'              => server_id,
              'links'           => mock_data['links'],
            }
          end

          if block_devices = options["block_device_mapping_v2"]
            block_devices.each { |bd| compute.volumes.get(bd[:uuid]).attach(server_id, bd[:device_name]) }
          elsif block_device = options["block_device_mapping"]
            compute.volumes.get(block_device[:volume_id]).attach(server_id, block_device[:device_name])
          end

          self.data[:last_modified][:servers][server_id] = Time.now
          self.data[:servers][server_id] = mock_data
          if security_groups = options['security_groups'] then
            groups = Array(options['security_groups']).map do |sg|
              if sg.is_a?(Fog::Compute::OpenStack::SecurityGroup) then
                sg.name
              else
                sg
              end
            end

            self.data[:server_security_group_map][server_id] = groups
            response_data['security_groups'] = groups
          end

          self.data[:last_modified][:servers][server_id] = Time.now
          self.data[:servers][server_id] = mock_data
          if options['return_reservation_id'] == 'True' then
            response.body = response_data
          else
            response.body = { 'server' => response_data }
          end
          response
        end
      end
    end
  end
end
