module Fog
  module Compute
    class Google
      class Mock
        def list_instance_group_instances(group, zone)
          Fog::Mock.not_implemented
        end
      end

      class Real
        def list_instance_group_instances(group, zone)
          api_method = @compute.instance_groups.list_instances
          parameters = {
            'project' => @project,
            'zone' => zone,
            'group' => group
          }

          request(api_method, parameters)
        end
      end
    end
  end
end
