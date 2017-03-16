require 'fog/core/collection'
require 'fog/sakuracloud/models/network/switch'

module Fog
  module Network
    class SakuraCloud
      class Switches < Fog::Collection
        model Fog::Network::SakuraCloud::Switch

        def all
          load service.list_switches.body['Switches']
        end

        def get(id)
          all.find { |f| f.id == id }
        rescue Fog::Errors::NotFound
          nil
        end

        def delete(id)
          service.delete_switch(id)
          true
        end
      end
    end
  end
end
