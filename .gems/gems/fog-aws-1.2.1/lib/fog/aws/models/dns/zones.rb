require 'fog/aws/models/dns/zone'

module Fog
  module DNS
    class AWS
      class Zones < Fog::Collection
        attribute :marker,    :aliases => 'Marker'
        attribute :max_items, :aliases => 'MaxItems'

        model Fog::DNS::AWS::Zone

        def all(options = {})
          options[:marker]   ||= marker unless marker.nil?
          options[:maxitems] ||= max_items unless max_items.nil?
          data = service.list_hosted_zones(options).body['HostedZones']
          load(data)
        end

        def get(zone_id)
          data = service.get_hosted_zone(zone_id).body
          new(data)
        rescue Fog::DNS::AWS::NotFound
          nil
        end
      end
    end
  end
end
