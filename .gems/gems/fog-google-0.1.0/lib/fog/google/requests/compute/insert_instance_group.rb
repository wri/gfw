module Fog
  module Compute
    class Google
      class Mock
        def insert_instance_group(group_name, zone, options = {})
          Fog::Mock.not_implemented
        end
      end

      class Real
        def insert_instance_group(group_name, zone, options = {})
          api_method = @compute.instance_groups.insert
          parameters = {
            'project' => @project,
            'zone' => zone
          }

          id = Fog::Mock.random_numbers(19).to_s

          body = {
            'name' => group_name,
            'network' => "https://www.googleapis.com/compute/#{api_version}/projects/#{@project}/global/networks/default",
          }
          body['description'] = options['description'] if options['description']

          request(api_method, parameters, body)
        end
      end
    end
  end
end
