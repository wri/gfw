require 'fog/core/collection'
require 'fog/sakuracloud/models/network/router'

module Fog
  module Network
    class SakuraCloud
      class Routers < Fog::Collection
        model Fog::Network::SakuraCloud::Router

        def all
          load service.list_routers.body['Internet']
        end

        def get(id)
          all.find { |f| f.id == id }
        rescue Fog::Errors::NotFound
          nil
        end

        def delete(id)
          service.delete_router(id)
          true
        end
      end
    end
  end
end
