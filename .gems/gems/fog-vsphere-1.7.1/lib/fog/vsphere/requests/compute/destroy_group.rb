module Fog
  module Compute
    class Vsphere
      class Real
        def destroy_group(attributes = {})
          cluster = get_raw_cluster(attributes[:cluster], attributes[:datacenter])
          group   = cluster.configurationEx.group.find {|g| g.name == attributes[:name]}
          raise Fog::Vsphere::Error::NotFound, "group #{attributes[:name]} not found" unless group
          delete_spec = RbVmomi::VIM.ClusterConfigSpecEx(groupSpec: [
            RbVmomi::VIM.ClusterGroupSpec(
              operation: RbVmomi::VIM.ArrayUpdateOperation('remove'),
              removeKey: group.name
            )
          ])
          cluster.ReconfigureComputeResource_Task(spec: delete_spec, modify: true).wait_for_completion
        end
      end
      class Mock
        def destroy_group(attributes = {})
          group = self.data[:groups][attributes[:name]]
          raise Fog::Vsphere::Error::NotFound unless group
          self.data[:groups].delete(attributes[:name])
        end
      end
    end
  end
end
