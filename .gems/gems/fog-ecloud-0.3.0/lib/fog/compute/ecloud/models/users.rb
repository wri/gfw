require File.expand_path("../user", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Users < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::User

        def all
          data = service.get_users(href).body[:User]
          load(data)
        end

        def get(uri)
          if data = service.get_user(uri)
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
