module Fog
  module Compute
    class Google
      # XXX @ihmccreery added this mock to get the Shindo tests to pass.  I don't really understand how mocks are supposed to work; I'm in the process of moving
      # all testing over to Minitest, but in the meantime, the Shindo tests need to pass.  This Mock should be considered with a *lot* of skepticism.
      class Mock
        def list_aggregated_target_instances(options = {})
          # Create a Hash of unique zones from the target_instances Array previously filled when target_instances are created
          zones = Hash[self.data[:target_instances].values.map { |target_instance| ["zones/#{target_instance['zone'].split('/')[-1]}", {'targetInstances' => [] }] }]
          if options[:filter]
            # Look up for the target_instance name
            target_instance = self.data[:target_instances][options[:filter].gsub(/name eq \.\*/, '')]
            # Fill the zones Hash with the target_instance (if it's found)
            zones["zones/#{target_instance['zone'].split('/')[-1]}"]['targetInstances'].concat([target_instance]) if target_instance
          else
            # Fill the zones Hash with the target_instances attached to each zone
            self.data[:target_instances].values.each { |target_instance| zones["zones/#{target_instance['zone'].split('/')[-1]}"]['targetInstances'].concat([target_instance]) }
          end
          build_excon_response({
            "kind" => "compute#targetInstanceAggregatedList",
            "selfLink" => "https://www.googleapis.com/compute/#{api_version}/projects/#{@project}/aggregated/targetInstances",
            "id" => "projects/#{@project}/aggregated/targetInstances",
            "items" => zones

          })
        end
      end

      class Real
        def list_aggregated_target_instances(options = {})
          api_method = @compute.target_instances.aggregated_list
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
