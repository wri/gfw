require 'fog/core/collection'
require 'fog/sakuracloud/models/dns/zone'

module Fog
  module DNS
    class SakuraCloud
      class Zones < Fog::Collection
        model Fog::DNS::SakuraCloud::Zone

        def all
          load service.list_zones.body['CommonServiceItems']
        end

        def get(id)
          all.find { |f| f.id == id }
        rescue Fog::Errors::NotFound
          nil
        end

        def delete(id)
          service.delete_zone(id)
          true
        end
      end
    end
  end
end
