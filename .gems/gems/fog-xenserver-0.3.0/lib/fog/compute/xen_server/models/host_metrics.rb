module Fog
  module Compute
    class XenServer
      module Models
        class HostMetrics < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=host_metrics

          provider_class :host_metrics
          collection_name :hosts_metrics

          identity :reference

          attribute :last_updated,  :type => :time
          attribute :live
          attribute :memory_free
          attribute :memory_total
          attribute :other_config
          attribute :uuid
        end
      end
    end
  end
end