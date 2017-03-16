require File.expand_path("../ip_address", __FILE__)

module Fog
  module Compute
    class Ecloud
      class IpAddresses < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::IpAddress

        def all
          data = service.get_network(href).body
          data = if data[:IpAddresses]
                   data[:IpAddresses][:IpAddress]
                 else
                   data
                 end
          data = data.nil? ? [] : data
          load(data)
        end

        def get(uri)
          if data = service.get_ip_address(uri)
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
