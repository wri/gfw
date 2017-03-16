module Fog
  module Compute
    class XenServer
      module Models
        class CrashDump < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=crashdump

          provider_class :crashdump
          collection_name :crash_dumps

          identity :reference

          attribute :other_config
          attribute :uuid

          has_one_identity :vdi,           :vdis,        :aliases => :VDI,    :as => :VDI
          has_one_identity :vm,            :servers,     :aliases => :VM,     :as => :VM
        end
      end
    end
  end
end