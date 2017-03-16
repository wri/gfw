module Fog
  module Compute
    class Aliyun
      class Real
        def delete_security_group(security_group_id)
          # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/securitygroup&deletesecuritygroup]
          action = 'DeleteSecurityGroup'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          if security_group_id
            parameters["SecurityGroupId"] = security_group_id
            pathUrl += '&SecurityGroupId='
            pathUrl += security_group_id	
          else
            raise ArgumentError, "Missing required securyti id "
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
        def delete_security_group(security_group_id)
          self.data[:security_groups].delete security_group_id.to_s

          response = Excon::Response.new
          response.status = 202
          response.headers = {
            "Content-Type" => "text/html; charset=UTF-8",
            "Content-Length" => "0",
            "Date" => Date.new
          }
          response.body = {}
          response
        end
      end # mock
    end # aliyun
  end # compute
end #fog
