module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/instance&rebootinstance]
        def reboot_server(server_id, options = {})

          _action = 'RebootInstance'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _parameters['InstanceId']=server_id
          _pathURL += '&InstanceId='+server_id
            
          _ForceStop = options[:aliyun_ForceStop]
          if _ForceStop
            _parameters['ForceStop']=_ForceStop
            _pathURL += '&ForceStop='+_ForceStop
          end
          
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
        def reboot_server(server_id, type = 'SOFT')
          response = Excon::Response.new
          response.status = 202
          response
        end
      end
    end
  end
end
