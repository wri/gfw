require 'fog/core/collection'
require 'fog/google/models/compute/url_map'

module Fog
  module Compute
    class Google
      class UrlMaps < Fog::Collection
        model Fog::Compute::Google::UrlMap

        def all
          data = service.list_url_maps.body['items'] || []
          load(data)
        end

        def get(identity)
          if url_map = service.get_url_map(identity).body
            new(url_map)
          end
        rescue Fog::Errors::NotFound
          nil
        end
      end
    end
  end
end
