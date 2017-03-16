module Fog
  module Compute
    class XenServer
      module Models
        class ServerAppliance < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VM_appliance

          provider_class :VM_appliance
          collection_name :server_appliances

          identity :reference

          attribute :allowed_operations
          attribute :current_operations
          attribute :description,             :aliases => :name_description
          attribute :name,                    :aliases => :name_label
          attribute :uuid

          has_many_identities  :vms,   :servers,         :aliases => :VMs,   :as => :VMs
        end
      end
    end
  end
end