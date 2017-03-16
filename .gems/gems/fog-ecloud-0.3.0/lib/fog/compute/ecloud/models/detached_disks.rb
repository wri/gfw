require File.expand_path("../detached_disk", __FILE__)

module Fog
  module Compute
    class Ecloud
      class DetachedDisks < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::DetachedDisk

        def all
          data = service.get_detached_disks(href).body[:DetachedDisk]
          data = [] if data.nil?
          load(data)
        end

        def get(uri)
          data = service.get_detached_disk(uri).body
          new(data)
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
