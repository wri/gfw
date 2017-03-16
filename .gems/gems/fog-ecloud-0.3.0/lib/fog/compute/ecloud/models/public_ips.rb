require File.expand_path("../public_ip", __FILE__)

module Fog
  module Compute
    class Ecloud
      class PublicIps < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::PublicIp

        def all
          data = service.get_public_ips(href).body
          data = data[:PublicIp] ? data[:PublicIp] : data
          load(data)
        end

        def get(uri)
          data = service.get_public_ip(uri).body
          new(data)
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end

        def activate
          data = service.public_ip_activate(href + "/action/activatePublicIp").body
          Fog::Compute::Ecloud::PublicIps.new(:service => service, :href => data[:href])[0]
        end
      end
    end
  end
end
