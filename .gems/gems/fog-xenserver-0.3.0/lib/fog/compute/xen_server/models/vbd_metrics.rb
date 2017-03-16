module Fog
  module Compute
    class XenServer
      module Models
        class VbdMetrics < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VBD_metrics

          provider_class :VBD_metrics
          collection_name :vbds_metrics

          identity :reference

          attribute :io_read_kbs
          attribute :io_write_kbs
          attribute :last_updated,   :type => :time
          attribute :other_config
          attribute :uuid
        end
      end
    end
  end
end