require "fog/compute/models/server"

module Fog
  module Compute
    class XenServer
      module Models
        class Server < Fog::Compute::Server
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VM

          extend ClassMethods
          include InstanceMethods

          provider_class :VM
          collection_name :servers

          identity :reference

          attribute :actions_after_crash,                                             :default => "Restart"
          attribute :actions_after_reboot,                                            :default => "Restart"
          attribute :actions_after_shutdown,                                          :default => "Destroy"
          attribute :allowed_operations
          attribute :blobs
          attribute :blocked_operations
          attribute :bios_strings
          attribute :current_operations
          attribute :domarch
          attribute :domid
          attribute :description,                 :aliases => :name_description,      :default => "",         :as => :name_description
          attribute :generation_id
          attribute :ha_always_run
          attribute :ha_restart_priority
          attribute :hvm_boot_params,             :aliases => :HVM_boot_params,       :default => {},         :as => :HVM_boot_params
          attribute :hvm_boot_policy,             :aliases => :HVM_boot_policy,       :default => "",         :as => :HVM_boot_policy
          attribute :hvm_shadow_multiplier,       :aliases => :HVM_shadow_multiplier,                         :as => :HVM_shadow_multiplier
          attribute :is_a_snapshot
          attribute :is_a_template,                                                   :default => true
          attribute :is_control_domain
          attribute :is_snapshot_from_vmpp
          attribute :last_booted_record
          attribute :last_boot_cpu_flags,         :aliases => :last_boot_CPU_flags,                           :as => :last_boot_CPU_flags
          attribute :memory_dynamic_max,                                              :default => "536870912"
          attribute :memory_dynamic_min,                                              :default => "536870912"
          attribute :memory_overhead
          attribute :memory_static_max,                                               :default => "536870912"
          attribute :memory_static_min,                                               :default => "536870912"
          attribute :memory_target
          attribute :name,                        :aliases => :name_label,            :default => "",         :as => :name_label
          attribute :order
          attribute :other_config,                                                    :default => {}
          attribute :pci_bus,                     :aliases => :PCI_bus,               :default => "",         :as => :PCI_bus
          attribute :platform,                                                        :default => { "nx" => "true",
                                                                                                    "acpi" => "true",
                                                                                                    "apic" => "true",
                                                                                                    "pae" => "true",
                                                                                                    "viridian" => "true" }
          attribute :power_state
          attribute :pv_args,                     :aliases => :PV_args,               :default => "-- quiet console=hvc0",  :as => :PV_args
          attribute :pv_bootloader,               :aliases => :PV_bootloader,         :default => "pygrub",                 :as => :PV_bootloader
          attribute :pv_bootloader_args,          :aliases => :PV_bootloader_args,    :default => "",                       :as => :PV_bootloader_args
          attribute :pv_kernel,                   :aliases => :PV_kernel,             :default => "",                       :as => :PV_kernel
          attribute :pv_legacy_args,              :aliases => :PV_legacy_args,        :default => "",                       :as => :PV_legacy_args
          attribute :pv_ramdisk,                  :aliases => :PV_ramdisk,            :default => "",                       :as => :PV_ramdisk
          attribute :recommendations,                                                 :default => ""
          attribute :shutdown_delay
          attribute :snapshot_info
          attribute :snapshot_metadata
          attribute :snapshot_time,   :type => :time
          attribute :start_delay
          attribute :tags
          attribute :transportable_snapshot_id
          attribute :user_version,                                                    :default => "0"
          attribute :uuid
          attribute :vcpus_at_startup,            :aliases => :VCPUs_at_startup,      :default => "1",    :as => :VCPUs_at_startup
          attribute :vcpus_max,                   :aliases => :VCPUs_max,             :default => "1",    :as => :VCPUs_max
          attribute :vcpus_params,                :aliases => :VCPUs_params,          :default => {},     :as => :VCPUs_params
          attribute :version
          attribute :xenstore_data

          has_one_identity      :affinity,          :hosts
          has_one_identity      :appliance,         :server_appliances
          has_many_identities   :attached_pcis,     :pcis,                    :aliases => :attached_PCIs,   :as => :attached_PCIs
          has_many_identities   :children,          :servers
          has_many_identities   :consoles,          :consoles
          has_many_identities   :crash_dumps,       :crash_dumps
          has_one_identity      :guest_metrics,     :guests_metrics
          has_one_identity      :metrics,           :servers_metrics
          has_one_identity      :parent,            :servers
          has_one_identity      :protection_policy, :vmpps
          has_one_identity      :resident_on,       :hosts
          has_many_identities   :snapshots,         :servers
          has_one_identity      :snapshot_of,       :servers
          has_one_identity      :suspend_sr,        :storage_repositories,    :aliases => :suspend_SR,      :as => :suspend_SR
          has_one_identity      :suspend_vdi,       :vdis,                    :aliases => :suspend_VDI,     :as => :suspend_VDI
          has_many_identities   :vbds,              :vbds,                    :aliases => :VBDs,            :as => :VBDs
          has_many_identities   :vgpus,             :vgpus,                   :aliases => :VGPUs,           :as => :VGPUs
          has_many_identities   :vifs,              :vifs,                    :aliases => :VIFs,            :as => :VIFs
          has_many_identities   :vtpms,             :vtpms,                   :aliases => :VTPMs,           :as => :VTPMs

          require_before_save :name, :affinity

          def tools_installed?
            !guest_metrics.nil?
          end

          def home_hypervisor
            service.hosts.first
          end

          def mac_address
            vifs.first.mac
          end

          def running?
            reload
            power_state == "Running"
          end

          def halted?
            reload
            power_state == "Halted"
          end

          def destroy
            hard_shutdown
            vbds.map(&:destroy)
            service.destroy_record(reference, provider_class)
          end

          def start
            return false if running?
            service.start_vm(reference)
            wait_for(&:running?)
            true
          end

          def hard_shutdown
            return false if halted?
            service.hard_shutdown_vm(reference)
            wait_for(&:halted?)
            true
          end

          def clean_shutdown
            return false if halted?
            service.clean_shutdown_vm(reference)
            wait_for(&:halted?)
            true
          end

          def can_be_cloned?
            allowed_operations.include?("clone")
          end

          def clone(name)
            raise "Clone Operation not Allowed" unless can_be_cloned?
            self.reference = service.clone_vm(reference, name)
            reload
          end

          def revert(snapshot)
            snapshot = collection.get_by_reference_or_name_or_uuid(snapshot)
            service.revert_vm(snapshot.reference)
          end

          alias_method :revert_to, :revert
        end
      end
    end
  end
end
