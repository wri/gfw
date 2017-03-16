require 'fog/core/collection'
require 'fog/sakuracloud/models/network/interface'

module Fog
  module Network
    class SakuraCloud
      class Interfaces < Fog::Collection
        model Fog::Network::SakuraCloud::Interface

        def all
          load service.list_interfaces.body['Interfaces']
        end

        def get(id)
          all.find { |f| f.id == id }
        rescue Fog::Errors::NotFound
          nil
        end

        def regist_onto_server(server_id)
          id = service.regist_interface_to_server(server_id)
          get(id)
        end

        def connect_to_switch(id, switch_id)
          id = service.connect_interface_to_switch(id, switch_id)
          get(id)
        end

        def delete(id)
          service.delete_interface(id)
          true
        end
      end
    end
  end
end
