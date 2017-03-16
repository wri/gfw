module Fog
  module Compute
    class Aliyun
      class Real
        def delete_server(server_id)
          # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/instance&deleteinstance]
          _action = 'DeleteInstance'
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
        end
      end

      class Mock
        def delete_server(server_id)
          response = Excon::Response.new
          if server = list_servers_detail.body['servers'].find {|_| _['id'] == server_id}
            if server['status'] == 'BUILD'
              response.status = 409
              raise(Excon::Errors.status_error({:expects => 204}, response))
            else
              self.data[:last_modified][:servers].delete(server_id)
              self.data[:servers].delete(server_id)
              response.status = 204
            end
            response
          else
            raise Fog::Compute::OpenStack::NotFound
          end
        end
      end
    end
  end
end
