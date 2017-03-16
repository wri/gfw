require 'fog/core/collection'
require 'fog/google/models/compute/target_instance'

module Fog
  module Compute
    class Google
      class TargetInstances < Fog::Collection
        model Fog::Compute::Google::TargetInstance

        def all(filters={})
          if filters['zone']
            data = service.list_target_instances(filters['zone']).body['items'] || []
          else
            data = []
            service.list_aggregated_target_instances.body['items'].each_value do |zone|
              data.concat(zone['targetInstances']) if zone['targetInstances']
            end
          end
          load(data)
        end

        def get(identity, zone=nil)
          response = nil
          if zone
            response = service.get_target_instance(identity, zone).body
          else
            target_instances = service.list_aggregated_target_instances(:filter => "name eq .*#{identity}").body['items']
            target_instance = target_instances.each_value.select { |zone| zone.key?('targetInstances') }

            # It can only be 1 target_instance with the same name across all regions
            response = target_instance.first['targetInstances'].first unless target_instance.empty?
          end
          return nil if response.nil?
          new(response)
        rescue Fog::Errors::NotFound
          nil
        end
      end
    end
  end
end
