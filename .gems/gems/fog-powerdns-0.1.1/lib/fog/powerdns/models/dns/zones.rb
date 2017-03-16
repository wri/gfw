require 'fog/core/collection'
require 'fog/powerdns/models/dns/zone'

module Fog
  module DNS
    class PowerDNS
      class Zones < Fog::Collection
        model Fog::DNS::PowerDNS::Zone

        # attribute :zone,    :aliases => 'name'

        def all
          clear
          data = service.list_zones.body
          load(data)
        end

        def get(zone)
          data = service.get_zone(zone).body['zone']
          zone = new(data)
          zone
        rescue Fog::Service::NotFound
          puts 'help!'
        end

      end
    end
  end
end