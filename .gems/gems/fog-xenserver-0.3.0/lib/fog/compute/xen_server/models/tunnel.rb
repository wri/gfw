module Fog
  module Compute
    class XenServer
      module Models
        class Tunnel < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=tunnel

          provider_class :tunnel
          collection_name :tunnels

          identity :reference

          attribute :other_config
          attribute :status
          attribute :uuid

          has_one_identity :access_pif,     :pifs,     :aliases => :access_PIF,     :as => :access_PIF
          has_one_identity :transport_pif,  :pifs,     :aliases => :transport_PIF,  :as => :transport_PIF
        end
      end
    end
  end
end