module Fog
  module Compute
    class XenServer
      module Models
        class Vlan < Model
          # API Reference here:
          # @see http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VLAN

          provider_class :VLAN
          collection_name :vlans

          identity :reference

          attribute :other_config
          attribute :tag,                :type => :integer
          attribute :uuid

          has_one_identity   :tagged_pif,   :pifs,   :aliases => :tagged_PIF,   :as => :tagged_PIF
          has_one_identity   :untagged_pif, :pifs,   :aliases => :untagged_PIF, :as => :untagged_PIF

          require_before_save :tag
        end
      end
    end
  end
end