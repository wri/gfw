module Fog
  module Compute
    class XenServer
      module Models
        class HostCrashDump < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=host_crashdump

          provider_class :host_crashdump
          collection_name :host_crash_dumps

          identity :reference

          attribute :other_config
          attribute :size
          attribute :timestamp
          attribute :uuid

          has_one_identity   :host,       :hosts
        end
      end
    end
  end
end