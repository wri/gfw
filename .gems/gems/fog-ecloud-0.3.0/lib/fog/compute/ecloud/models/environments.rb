require File.expand_path("../environment", __FILE__)

module Fog
  module Compute
    class Ecloud
      class Environments < Fog::Ecloud::Collection
        model Fog::Compute::Ecloud::Environment

        undef_method :create

        identity :href

        def all
          data = []
          raw_location = service.get_organization(href).body[:Locations][:Location]
          if raw_location.is_a?(Array)
            # If there's more than one location, the XML parser returns an
            # array.
            location = raw_location
          else
            # Otherwise it returns a hash.
            location = [raw_location]
          end

          location.each do |l|
            environments = l[:Environments]
            next unless environments
            if environments[:Environment].is_a?(Array)
              environments[:Environment].each { |e| data << e }
            else
              data << environments[:Environment]
            end
          end
          load(data)
        end

        def get(uri)
          if data = service.get_environment(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end

        Vdcs = Environments
      end
    end
  end
end
