module Fog
  module Compute
    class Aliyun
      class Real
        def create_vpc(cidrBlock, options={})
          # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/vpc&createvpc]
          action = 'CreateVpc'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          parameters["CidrBlock"] = cidrBlock
          pathUrl += '&CidrBlock='
          pathUrl += URI.encode(cidrBlock,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')	

          name = options[:name]
          desc = options[:description]

          if name
            parameters["VpcName"] = name
            pathUrl += '&VpcName='
            pathUrl += name	
          end

          if desc
            parameters["Description"] = desc
            pathUrl += '&Description='
            pathUrl += desc	
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
