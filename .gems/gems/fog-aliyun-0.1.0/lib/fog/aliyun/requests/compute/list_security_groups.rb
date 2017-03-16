module Fog
  module Compute
    class Aliyun
      class Real
        # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/securitygroup&describesecuritygroup]
        def list_security_groups(options={})

          action = 'DescribeSecurityGroups'
          sigNonce = randonStr()
          time = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)

          pageNumber = options[:pageNumber]
          pageSize   = options[:pageSize]
          vpcId      = options[:vpcId]
          
          if vpcId
            parameters["VpcId"] = vpcId
            pathUrl += '&VpcId='
            pathUrl += vpcId
          end

          if pageNumber
            parameters["PageNumber"] = pageNumber
            pathUrl += '&PageNumber='
            pathUrl += pageNumber
          end

          pageSize   = options[:pageSize]
          unless pageSize
            pageSize = '50'
          end
          parameters["PageSize"] = pageSize  
          pathUrl += '&PageSize='
          pathUrl += pageSize	

          signature = sign(@aliyun_accesskey_secret, parameters)
          pathUrl += '&Signature='
          pathUrl += signature

          request(
            :expects  => [200],
            :method   => 'GET',
            :path     => pathUrl
          )
        end
      end

      class Mock
        def list_security_groups(server_id = nil)
          security_groups = self.data[:security_groups].values

          groups = if server_id then
                     server_group_names =
                       Array(self.data[:server_security_group_map][server_id])

                     server_group_names.map do |name|
                       security_groups.find do |sg|
                         sg['name'] == name
                       end
                     end.compact
                   else
                     security_groups
                   end

          Excon::Response.new(
            :body     => { 'security_groups' => groups },
            :headers  => {
              "X-Compute-Request-Id" => "req-#{Fog::Mock.random_base64(36)}",
              "Content-Type" => "application/json",
              "Date" => Date.new
            },
            :status   => 200
          )
        end
      end # mock
    end # aliyun
  end # compute
end # fog
