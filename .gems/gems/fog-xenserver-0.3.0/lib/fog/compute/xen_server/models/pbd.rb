module Fog
  module Compute
    class XenServer
      module Models
        class Pbd < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=PBD

          provider_class :PBD
          collection_name :pbds

          identity :reference

          attribute :currently_attached
          attribute :device_config
          attribute :other_config
          attribute :uuid

          has_one_identity :host,  :hosts
          has_one_identity :sr,    :storage_repositories,    :aliases => :SR,   :as => :SR

          alias_method :storage_repository, :sr
        end
      end
    end
  end
end