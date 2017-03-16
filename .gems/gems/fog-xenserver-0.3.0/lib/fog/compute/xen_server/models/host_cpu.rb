module Fog
  module Compute
    class XenServer
      module Models
        class HostCpu < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=host_cpu

          provider_class :host_cpu
          collection_name :host_cpus

          identity :reference

          attribute :family
          attribute :features
          attribute :flags
          attribute :model
          attribute :model_name,      :aliases => :modelname,   :as => :modelname
          attribute :number
          attribute :other_config
          attribute :speed
          attribute :stepping
          attribute :utilisation
          attribute :uuid
          attribute :vendor

          has_one_identity   :host,       :hosts
        end
      end
    end
  end
end