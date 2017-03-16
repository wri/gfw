module Fog
  module Compute
    class Google
      class Mock
        def remove_instance_group_instance(group_name, zone, instances)
          Fog::Mock.not_implemented
        end
      end

      class Real
        def remove_instance_group_instance(group_name, zone, instance_name)
          api_method = @compute.instance_groups.remove_instances

          parameters = {
            'project' => @project,
            'instanceGroup' => group_name,
            'zone' => zone
          }

          body_object = {
            "instances" => [
              {
                "instance" => "https://www.googleapis.com/compute/#{api_version}/projects/#{@project}/zones/#{zone}/instances/#{instance_name}\n"
              }
            ]
          }

          request(api_method, parameters, body_object)
        end
      end
    end
  end
end
