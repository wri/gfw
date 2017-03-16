module Fog
  module Compute
    class Aliyun
      class Real
        # Associate an avalable eip IP address to the given instance.
        #
        # ==== Parameters
        # * server_id<~String> - id of the instance
        # * allocationId<~String> - id of the EIP
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'RequestId'<~String> - Id of the request
        #
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.201.106.DGkmH7#/pub/ecs/open-api/network&associateeipaddresss]
        def associate_eip_address(server_id, allocationId,options={})
          
          _action = 'AssociateEipAddress'
          _sigNonce = randonStr()
          _time = Time.new.utc

          type=options['instance_type']

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _parameters['InstanceId'] = server_id
          _pathURL += '&InstanceId='+server_id
          
          _parameters['AllocationId'] = allocationId
          _pathURL += '&AllocationId='+allocationId

          if type
            _parameters['InstanceType'] = type
            _pathURL += 'InstanceType='+type
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
        def allocate_address(pool = nil)
          response = Excon::Response.new
          response.status = 200
          response.headers = {
            "X-Compute-Request-Id" => "req-d4a21158-a86c-44a6-983a-e25645907f26",
            "Content-Type" => "application/json",
            "Content-Length" => "105",
            "Date"=> Date.new
          }
          response.body = {
            "floating_ip" => {
              "instance_id" => nil,
              "ip" => "192.168.27.132",
              "fixed_ip" => nil,
              "id" => 4,
              "pool"=>"nova"
            }
          }
          response
        end
      end # mock
    end # aliyun
  end #compute
end
