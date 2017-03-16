module Fog
  module Compute
    class Aliyun
      class Real
        def delete_security_group_sg_rule(securitygroup_id, source_securitygroup_id, option={})
          # {Aliyun API Reference}[https://docs.aliyun.com/?spm=5176.100054.3.1.DGkmH7#/pub/ecs/open-api/securitygroup&revokesecuritygroup]
          action   = 'RevokeSecurityGroup'
          sigNonce = randonStr()
          time     = Time.new.utc

          parameters = defalutParameters(action, sigNonce, time)
          pathUrl    = defaultAliyunUri(action, sigNonce, time)
          
          parameters["SecurityGroupId"] = securitygroup_id
          pathUrl += '&SecurityGroupId='
          pathUrl += securitygroup_id

          parameters["SourceGroupId"] = source_securitygroup_id
          pathUrl += '&SourceGroupId='
          pathUrl += source_securitygroup_id

          nicType = 'intranet'
          parameters["NicType"] = nicType
          pathUrl += '&NicType='
          pathUrl += nicType
          
          portRange = option[:portRange]
          unless portRange
            portRange = '-1/-1'
          end
          parameters["PortRange"] = portRange
          pathUrl += '&PortRange='
          pathUrl += URI.encode(portRange,'/[^!*\'()\;?:@#&%=+$,{}[]<>`" ')
          
          protocol = option[:protocol]
          unless protocol
            protocol = 'all'
          end
          parameters["IpProtocol"] = protocol
          pathUrl += '&IpProtocol='
          pathUrl += protocol

          sourceGOAccount = option[:sourceGroupOwnerAccount]
          if sourceGOAccount
           parameters["SourceGroupOwnerAccount"]=sourceGOAccount
           pathUrl += '&SourceGroupOwnerAccount='
           pathUrl += sourceGOAccount
          end

          policy = option[:policy]
          unless policy
            policy = 'accept'
          end
          parameters["Policy"] = policy
          pathUrl += '&Policy='
          pathUrl += policy

          priority = option[:priority]
          unless priority
            priority = '1'
          end
          parameters["Priority"] = priority
          pathUrl += '&Priority='
          pathUrl += priority

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
        def create_security_group_rule(parent_group_id, ip_protocol, from_port, to_port, cidr, group_id=nil)
          parent_group_id = parent_group_id.to_i
          response = Excon::Response.new
          response.status = 200
          response.headers = {
            'X-Compute-Request-Id' => "req-#{Fog::Mock.random_hex(32)}",
            'Content-Type'   => 'application/json',
            'Content-Length' => Fog::Mock.random_numbers(3).to_s,
            'Date' => Date.new
          }
          rule = {
            'id' => Fog::Mock.random_numbers(2).to_i,
            'from_port'   => from_port,
            'group'       => group_id || {},
            'ip_protocol' => ip_protocol,
            'to_port'     => to_port,
            'parent_group_id' => parent_group_id,
            'ip_range' => {
              'cidr'   => cidr
            }
          }
          self.data[:security_groups][parent_group_id.to_s]['rules'].push(rule)
          response.body = {
            'security_group_rule' => rule
          }
          response
        end
      end # mock
    end # aliyun
  end # compute
end # fog
