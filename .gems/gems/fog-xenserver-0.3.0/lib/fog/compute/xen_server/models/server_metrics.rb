module Fog
  module Compute
    class XenServer
      module Models
        class ServerMetrics < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VM_metrics

          provider_class :VM_metrics
          collection_name :servers_metrics

          identity :reference

          attribute :install_time
          attribute :last_updated
          attribute :memory_actual
          attribute :other_config
          attribute :start_time
          attribute :state
          attribute :uuid
          attribute :vcpus_cpu,           :aliases => :VCPUs_CPU,         :as => :VCPUs_CPU
          attribute :vcpus_flags,         :aliases => :VCPUs_flags,       :as => :VCPUs_flags
          attribute :vcpus_number,        :aliases => :VCPUs_number,      :as => :VCPUs_number
          attribute :vcpus_params,        :aliases => :VCPUs_params,      :as => :VCPUs_params
          attribute :vcpus_utilisation,   :aliases => :VCPUs_utilisation, :as => :VCPUs_utilisation
        end
      end
    end
  end
end