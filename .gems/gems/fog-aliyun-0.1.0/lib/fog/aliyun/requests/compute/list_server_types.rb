module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/other&describeinstancetypes]
        def list_server_types
          _action = 'DescribeInstanceTypes'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _signature = sign(@aliyun_accesskey_secret, _parameters)
          _pathURL += '&Signature='+_signature
          
          response = request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => _pathURL
          )

          #_InstanceType = Hash.new
          #_InstanceTypeList =  Fog::JSON.decode(response.body)["InstanceTypes"]["InstanceType"]
          #_InstanceTypeList.each do |instanceType|
          #  _InstanceType[[instanceType["CpuCoreCount"], instanceType["MemorySize"]]] = instanceType["InstanceTypeId"]
          #end
          #_InstanceType
        end #end list_server_types
        
        def get_instance_type(cpuCount, memorySize)
          _action = 'DescribeInstanceTypes'
          _sigNonce = randonStr()
          _time = Time.new.utc

          _parameters = defalutParameters(_action, _sigNonce, _time)
          _pathURL  = defaultAliyunUri(_action, _sigNonce, _time)
          
          _signature = sign(@aliyun_accesskey_secret, _parameters)
          _pathURL += '&Signature='+_signature
          
          response = request(
            :expects  => [200, 203],
            :method   => 'GET',
            :path     => _pathURL
          )

          _InstanceTypeId = nil
          _InstanceTypeList =  Fog::JSON.decode(response.body)["InstanceTypes"]["InstanceType"]
          _InstanceTypeList.each do |instanceType|
            if ((instanceType["CpuCoreCount"] == cpuCount) && (instanceType["MemorySize"] == memorySize))
              _InstanceTypeId = instanceType["InstanceTypeId"]
              puts "_instanceTypeId: "+_InstanceTypeId
              break
            end #end if
          end #end each
          _InstanceTypeId
        end #end get_instance_type
      end #end class Real

#      class Mock
#        def list_servers(options = {})
#          response = Excon::Response.new
#          data = list_servers_detail.body['servers']
#          servers = []
#          for server in data
#            servers << server.reject { |key, value| !['id', 'name', 'links'].include?(key) }
#          end
#          response.status = [200, 203][rand(1)]
#          response.body = { 'servers' => servers }
#          response
#        end
#      end
    end #end class Aliyun
  end #end module Compute
#end module Fog
end