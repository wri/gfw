require 'fog/core/model'

module Fog
  module Compute
    class Aliyun
      class SecurityGroup < Fog::Model
        identity  :id,           :aliases =>"SecurityGroupId"
        attribute :name,         :aliases => "SecurityGroupName"
        attribute :description,  :aliases => "Description"
        attribute :created_at,   :aliases => "CreationTime"
        attribute :vpc_id,       :aliases => "VpcId"

        def vpc
          requires :vpc_id
          service.vpcs.get(vpc_id)
        end

        def security_group_rules
          requires :id
          service.security_group_rules.get(id)
        end

        def save(options={})
          options[:vpcId] = vpc_id if vpc_id
          options[:name] = name if name
          options[:description] = description if description
          Fog::JSON.decode(service.create_security_group(options).body)
          true
        end

        def destroy
          requires :id
          service.delete_security_group(id)
          true
        end

        def authorize_security_group_sg_rule(group_id,direction="ingress",options={})
          requires :id
          if direction=="egress"
            service.create_security_group_egress_sg_rule(id,group_id,options)
          else
            service.create_security_group_sg_rule(id,group_id,options)
          end
          true
        end

        def authorize_security_group_ip_rule(cidr_ip,direction="ingress",options={})
          requires :id
          nic_type = options.fetch(:nic_type, "internet")
          if direction=="egress"
            service.create_security_group_egress_ip_rule(id,cidr_ip,nic_type,options)
          else
            service.create_security_group_ip_rule(id,cidr_ip,nic_type,options)
          end
          true
        end

        def revoke_seurity_group_sg_rule(group_id,direction="ingress",options={})
          requires :id
          if direction=="egress"
            service.delete_security_group_egress_sg_rule(id,group_id,options)
          else
            service.delete_security_group_sg_rule(id,group_id,options)
          end
          true
        end

        def revoke_security_group_ip_rule(cidr_ip,direction="ingress",options={})
          requires :id
          nic_type = options.fetch(:nic_type, "internet")
          if direction=="egress"
            service.delete_security_group_egress_ip_rule(id,cidr_ip,nic_type,options)
          else
            service.delete_security_group_ip_rule(id,cidr_ip,nic_type,options)
          end
          true
        end
      end
    end
  end
end
