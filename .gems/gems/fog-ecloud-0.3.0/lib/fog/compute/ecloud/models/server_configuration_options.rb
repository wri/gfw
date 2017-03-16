require File.expand_path("../server_configuration_option", __FILE__)

module Fog
  module Compute
    class Ecloud
      class ServerConfigurationOptions < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::ServerConfigurationOption

        def all
          data = service.get_server_configuration_options(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_server_configuration_option(uri)
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
