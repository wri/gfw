module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/network&describeeipaddress]
        def list_eip_addresses(options={})
          
          _action = 'DescribeEipAddresses'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _Status = options[:state]
          if _Status
            _parameters['Status']=_Status
            _pathURL += '&Status='+_Status
          end
          
          _EipAddress = options[:ip_address]
          if _EipAddress
            _parameters['EipAddress']=_EipAddress
            _pathURL += '&EipAddress='+_EipAddress
          end
          
          _AllocationId = options[:allocation_id]
          if _AllocationId
            _parameters['AllocationId']=_AllocationId
            _pathURL += '&AllocationId='+_AllocationId
          end
          
          _PageNumber = options[:page_number]
          if _PageNumber
            _parameters['PageNumber']=_PageNumber
            _pathURL += '&PageNumber='+_PageNumber
          end

          _PageSize   = options[:page_size]
          unless _PageSize
            _PageSize = '50'
          end
          _parameters['PageSize']=_PageSize
          _pathURL += '&PageSize='+_PageSize
          
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
