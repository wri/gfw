module Fog
  module Compute
    class Google
      class Mock
        def delete_instance_group(group_name, zone)
          Fog::Mock.not_implemented
        end
      end

      class Real
        def delete_instance_group(group_name, zone)
          api_method = @compute.instance_groups.delete
          parameters = {
            'instanceGroup' => group_name,
            'project' => @project,
            'zone' => zone
          }

          request(api_method, parameters)
        end
      end
    end
  end
end
