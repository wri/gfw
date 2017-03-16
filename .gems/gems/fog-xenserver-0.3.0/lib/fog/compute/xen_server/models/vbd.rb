module Fog
  module Compute
    class XenServer
      module Models
        class Vbd < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VBD

          provider_class :VBD
          collection_name :vbds

          identity :reference

          attribute :allowed_operations
          attribute :bootable,                  :default => true
          attribute :currently_attached
          attribute :current_operations
          attribute :device
          attribute :empty,                     :default => false
          attribute :mode,                      :default => "RW"
          attribute :other_config,              :default => { "owner" => "" }
          attribute :qos_supported_algorithms,  :default => []
          attribute :qos_algorithm_params,      :default => {}
          attribute :qos_algorithm_type,        :default => ""
          attribute :runtime_properties
          attribute :status_code
          attribute :status_detail
          attribute :storage_lock
          attribute :type,                      :default => "Disk"
          attribute :unpluggable
          attribute :userdevice,                :default => "0"
          attribute :uuid

          has_one_identity   :metrics,   :vbds_metrics
          has_one_identity   :vdi,       :vdis,             :aliases => :VDI, :as => :VDI
          has_one_identity   :vm,        :servers,          :aliases => :VM,  :as => :VM

          require_before_save :vdi, :vm

          alias_method :server, :vm

          def can_be_unplugged?
            allowed_operations.include?("unplug")
          end
          
          def unplug
            return service.unplug_vbd(reference) if can_be_unplugged?
            false
          end
          
          def disk?
            type == "Disk"
          end

          def destroy
            if disk?
              unplug
              vdi.destroy
            end
          end
        end
      end
    end
  end
end