require 'fog/core/model'

module Fog
  module Compute
    class Aliyun
      class SecurityGroupRule < Fog::Model
        attribute :security_group_id,         :aliases => 'SecurityGroupId'
        attribute :source_cidr_ip,            :aliases => 'SourceCidrIp'
        attribute :source_owner,              :aliases => 'SourceGroupOwnerAccount'
        attribute :source_group_id,           :aliases => 'SourceGroupId'
        attribute :ip_protocol,               :aliases => 'IpProtocol'
        attribute :dest_cidr_ip,              :aliases => 'DestCidrIp'
        attribute :dest_owner,                :aliases => 'DestGroupOwnerAccount'
        attribute :dest_group_id,             :aliases => 'DestGroupId'
        attribute :nic_type,                  :aliases => 'NicType'
        attribute :policy,                    :aliases => 'Policy'
        attribute :port_range,                :aliases => 'PortRange'
        attribute :direction,                 :aliases => 'Direction'
        attribute :priority,                  :aliases => 'Priority'

        def save
          requires :security_group_id,:ip_protocol,:port_range,:direction
          options={}
          options[:portRange] = port_range if port_range
          options[:policy] = policy if policy
          options[:priority] = priority if port_range
          options[:protocol] = ip_protocol if ip_protocol
          if direction=="egress"
            if dest_cidr_ip
              service.create_security_group_egress_ip_rule(security_group_id,dest_cidr_ip,nic_type,options)
            elsif dest_group_id
              options[:destGroupOwnerAccount] = dest_owner if dest_owner
              service.create_security_group_egress_sg_rule(security_group_id,dest_group_id,options)
            end
          else
            if source_cidr_ip
              service.create_security_group_ip_rule(security_group_id,source_cidr_ip,nic_type,options)
            elsif source_group_id
              options[:sourceGroupOwnerAccount] = source_owner if source_owner
              service.create_security_group_sg_rule(security_group_id,source_group_id,options)
            end
          end
        end
      end
    end
  end
end
