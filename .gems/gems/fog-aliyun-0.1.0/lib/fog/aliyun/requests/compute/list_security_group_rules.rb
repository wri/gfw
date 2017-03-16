module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/securitygroup&describesecuritygroupattribute]
        def list_security_group_rules(securityGroupId, options = {})

          action = 'DescribeSecurityGroupAttribute'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl = defaultAliyunUri(action, sigNonce, time)
          
          parameters["SecurityGroupId"] = securityGroupId
          pathUrl += '&SecurityGroupId='
          pathUrl += securityGroupId
          
          nicType = options[:nicType]
          if nicType
            parameters["NicType"] = nicType
            pathUrl += '&NicType='
            pathUrl += nicType
          end          
          pageNumber = options[:pageNumber]
          pageSize   = options[:pageSize]				
          if pageNumber
              parameters["PageNumber"] = pageNumber
              pathUrl += '&PageNumber='
              pathUrl += pageNumber
          end

          if pageSize
              parameters["PageSize"] = pageSize
              pathUrl += '&PageSize='
              pathUrl += pageSize	
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
        def get_security_group(security_group_id)
          security_group = self.data[:security_groups][security_group_id.to_s]
          response = Excon::Response.new
          if security_group
            response.status = 200
            response.headers = {
              "X-Compute-Request-Id" => "req-63a90344-7c4d-42e2-936c-fd748bced1b3",
              "Content-Type" => "application/json",
              "Content-Length" => "167",
              "Date" => Date.new
            }
            response.body = {
              "security_group" => security_group
            }
          else
            raise Fog::Compute::OpenStack::NotFound, "Security group #{security_group_id} does not exist"
          end
          response
        end
      end # mock
    end # aliyun
  end # compute
end # fog
