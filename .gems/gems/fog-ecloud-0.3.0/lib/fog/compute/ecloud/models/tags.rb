require File.expand_path("../tag", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Tags < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Tag

        def all
          data = service.get_tags(href).body[:DeviceTag]
          load(data)
        end

        def get(uri)
          if data = service.get_tag(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
