require File.expand_path("../firewall_acl", __FILE__)

module Fog
  module Compute
    class Ecloud
      class FirewallAcls < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::FirewallAcl

        def all
          data = service.get_firewall_acls(href).body
          data = data[:FirewallAcl] ? data[:FirewallAcl] : data
          load(data)
        end

        def get(uri)
          if data = service.get_firewall_acl(uri)
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
