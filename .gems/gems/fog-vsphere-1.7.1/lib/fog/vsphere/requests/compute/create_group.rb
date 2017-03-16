module Fog
  module Compute
    class Vsphere
      class Real
        def create_group(attributes={})
          cluster = get_raw_cluster(attributes[:cluster], attributes[:datacenter])
          group = cluster.configurationEx.group.find {|n| n[:name] == attributes[:name]}
          if group
            raise ArgumentError, "Group #{attributes[:name]} already exists!"
          end
          spec = get_group_spec attributes
          cluster_spec = RbVmomi::VIM.ClusterConfigSpecEx(groupSpec: [
              RbVmomi::VIM.ClusterGroupSpec(
                  operation: RbVmomi::VIM.ArrayUpdateOperation('add'),
                  info: spec
              )
          ])
          cluster.ReconfigureComputeResource_Task(spec: cluster_spec, modify: true).wait_for_completion
          group = cluster.configurationEx.group.find {|n| n[:name] == attributes[:name]}
          if group
            return group[:name]
          else
            raise Fog::Vsphere::Errors::ServiceError, "Unknown error creating group #{attributes[:name]}"
          end
        end

        private

        def get_group_spec(attributes={})
          if attributes[:type].to_s == 'ClusterVmGroup'
            vms = attributes[:vm_ids].to_a.map {|id| get_vm_ref(id, attributes[:datacenter])}
            attributes[:type].new(
                name: attributes[:name],
                vm: vms
            )
          elsif attributes[:type].to_s == 'ClusterHostGroup'
            attributes[:type].new(
                name: attributes[:name],
                host: attributes[:host_refs]
            )
          end
        end
      end

      class Mock
        def create_group(attributes={})
          self.data[:groups][attributes[:name]] = attributes
        end
      end
    end
  end
end
