module Fog
  module Compute
    class Vsphere
      # ClusterRuleInfo
      class Rule < Fog::Model
        identity :key
        
        attribute :datacenter
        attribute :cluster
        attribute :name
        attribute :enabled
        # Type should be a class - either
        #  - RbVmomi::VIM::ClusterAntiAffinityRuleSpec
        #  - RbVmomi::VIM::ClusterAffinityRuleSpec
        #  - RbVmomi::VIM::ClusterVmHostRuleInfo
        attribute :type
        attribute :vm_ids
        
        def vms
          vm_ids.map {|id| service.servers.get(id, datacenter) }
        end
        
        def vms=(vms)
          self.vm_ids = vms.map(&:instance_uuid)
        end
        
        def save
          requires :datacenter, :cluster, :name, :enabled, :type, :vm_ids
          if vm_ids.length < 2
            raise ArgumentError, "A rule must have at least 2 VMs"
          end
          if persisted?
            raise "Update is not supported yet"
          else
            self.key = service.create_rule(attributes)
          end
          reload
        end
        
        def destroy
          service.destroy_rule(attributes)
        end
        
      end
    end
  end
end
