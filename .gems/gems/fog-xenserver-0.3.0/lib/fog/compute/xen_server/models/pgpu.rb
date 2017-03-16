module Fog
  module Compute
    class XenServer
      module Models
        class Pgpu < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=PGPU

          provider_class :PGPU
          collection_name :pgpus

          identity :reference

          attribute :other_config
          attribute :uuid

          has_one_identity   :gpu_group,     :gpu_groups,  :aliases => :GPU_group,  :as => :GPU_group
          has_one_identity   :host,          :hosts
          has_one_identity   :pci,           :pcis,        :aliases => :PCI,        :as => :PCI
        end
      end
    end
  end
end