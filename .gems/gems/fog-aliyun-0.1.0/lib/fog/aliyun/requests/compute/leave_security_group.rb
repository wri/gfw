module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/instance&leavesecuritygroup]
        def leave_security_group(server_id, group_id)

          _action = 'LeaveSecurityGroup'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _parameters['InstanceId']=server_id
          _pathURL += '&InstanceId='+server_id
            
          _parameters['SecurityGroupId']=group_id
          _pathURL += '&SecurityGroupId='+group_id
          
          _signature = sign(@aliyun_accesskey_secret, _parameters)
          _pathURL += '&Signature='+_signature
          
          request(
            :expects => [200, 204],
            :method => 'GET',
            :path   => _pathURL
          )
        end
      end

      class Mock
        def add_security_group(server_id, group_name)
          response = Excon::Response.new
          response.status = 200
          response
        end
      end
    end
  end
end
