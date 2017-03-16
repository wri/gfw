module Fog
  module Compute
    class XenServer
      module Models
        class Pci < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=PCI

          provider_class :PCI
          collection_name :pcis

          identity :reference

          attribute :device_name
          attribute :other_config
          attribute :pci_id
          attribute :uuid
          attribute :vendor_name

          has_many_identities   :dependencies,  :pcis
          has_one_identity      :host,          :hosts
        end
      end
    end
  end
end