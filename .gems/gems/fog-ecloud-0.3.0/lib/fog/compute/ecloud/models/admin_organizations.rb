require File.expand_path("../admin_organization", __FILE__)

module Fog
  module Compute
    class Ecloud
      class AdminOrganizations < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::AdminOrganization

        def get(uri)
          if data = service.get_admin_organization(uri)
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
