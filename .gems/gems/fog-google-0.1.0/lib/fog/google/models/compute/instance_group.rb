require 'fog/core/model'

module Fog
  module Compute
    class Google
      class InstanceGroup < Fog::Model
        identity :name

        attribute :id
        attribute :kind
        attribute :creation_timestamp, :aliases => 'creationTimestamp'
        attribute :description
        attribute :fingerprint
        attribute :namedPorts
        attribute :network
        attribute :self_link, :aliases => 'selfLink'
        attribute :size
        attribute :zone, :aliases => :zone_name

        def save
          requires :name, :zone

          data = service.insert_instance_group(name, zone)
        end

        def destroy(async=true)
          requires :name, :zone
          
          data = service.delete_instance_group(name, zone_name)
        end

        def zone_name
          zone.nil? ? nil : zone.split('/')[-1]
        end

      end
    end
  end
end
