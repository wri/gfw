module Fog
  module Compute
    class Google
      class Mock
        def list_aggregated_instance_groups(options = {})
          Fog::Mock.not_implemented
        end
      end

      class Real
        def list_aggregated_instance_groups(options = {})
          api_method = @compute.instance_groups.aggregated_list
          parameters = {
            'project' => @project,
          }
          parameters['filter'] = options[:filter] if options[:filter]

          request(api_method, parameters)
        end
      end
    end
  end
end
