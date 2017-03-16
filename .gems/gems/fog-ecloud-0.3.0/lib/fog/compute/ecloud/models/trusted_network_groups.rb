require File.expand_path("../trusted_network_group", __FILE__)

module Fog
  module Compute
    class Ecloud
      class TrustedNetworkGroups < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::TrustedNetworkGroup

        def all
          data = service.get_trusted_network_groups(href).body
          data = data[:TrustedNetworkGroup] ? data[:TrustedNetworkGroup] : data
          load(data)
        end

        def get(uri)
          if data = service.get_trusted_network_group(uri)
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
