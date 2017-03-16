module Fog
  module Compute
    class Aliyun
      class Real
        # Stop the server.
        #
        # === Parameters
        # * server_id <~String> - The ID of the server to be stopped.
        # === Returns
        # * success <~Boolean>
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/instance&stopinstance]
        def stop_server(server_id)

          _action = 'StopInstance'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _parameters['InstanceId']=server_id
          _pathURL += '&InstanceId='+server_id
            
          _signature = sign(@aliyun_accesskey_secret, _parameters)
          _pathURL += '&Signature='+_signature
          
          request(
            :expects => [200, 204],
            :method => 'GET',
            :path   => _pathURL
          )
        end # def stop_server
      end # class Real

      class Mock
        def stop_server(server_id)
          true
        end # def stop_server
      end # class Mock
    end # class aliyun
  end # module Compute
end # module Fog