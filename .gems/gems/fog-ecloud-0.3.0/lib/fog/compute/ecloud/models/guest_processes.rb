require File.expand_path("../guest_process", __FILE__)

module Fog
  module Compute
    class Ecloud
      class GuestProcesses < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::GuestProcess

        def all
          data = service.get_guest_processes(href).body[:GuestProcess]
          load(data)
        end

        def get(uri)
          if data = service.get_guest_process(uri)
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
