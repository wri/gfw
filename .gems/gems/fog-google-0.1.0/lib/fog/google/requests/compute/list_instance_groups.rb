module Fog
  module Compute
    class Google
      class Mock
        def list_instance_groups(zone)
          Fog::Mock.not_implemented
        end
      end

      class Real
        def list_instance_groups(zone)
          api_method = @compute.instance_groups.list
          parameters = {
            'project' => @project,
            'zone' => zone
          }

          request(api_method, parameters)
        end
      end
    end
  end
end
