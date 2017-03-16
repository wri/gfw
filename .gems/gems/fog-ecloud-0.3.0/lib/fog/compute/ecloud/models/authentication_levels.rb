require File.expand_path("../authentication_level", __FILE__)

module Fog
  module Compute
    class Ecloud
      class AuthenticationLevels < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::AuthenticationLevel

        def all
          data = service.get_authentication_levels(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_authentication_level(uri)
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
