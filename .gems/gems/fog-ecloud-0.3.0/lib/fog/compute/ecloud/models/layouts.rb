require File.expand_path("../layout", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Layouts < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::Layout

        def all
          data = service.get_layouts(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_layout(uri)
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
