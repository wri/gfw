module Fog
  module Compute
    class XenServer
      module Models
        class Host < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=host

          provider_class :host
          collection_name :hosts

          identity :reference

          attribute :address
          attribute :allowed_operations
          attribute :api_version_major,                   :aliases => :API_version_major,                 :as => :API_version_major
          attribute :api_version_minor,                   :aliases => :API_version_minor,                 :as => :API_version_minor
          attribute :api_version_vendor,                  :aliases => :API_version_vendor,                :as => :API_version_vendor
          attribute :api_version_vendor_implementation,   :aliases => :API_version_vendor_implementation, :as => :API_version_vendor_implementation
          attribute :bios_strings
          attribute :blobs
          attribute :capabilities
          attribute :chipset_info
          attribute :cpu_configuration
          attribute :cpu_info
          attribute :current_operations
          attribute :description,                         :aliases => :name_description
          attribute :edition
          attribute :enabled
          attribute :external_auth_configuration
          attribute :external_auth_service_name
          attribute :external_auth_type
          attribute :guest_vcpus_params,                  :aliases => :guest_VCPUs_params,                :as => :guest_VCPUs_params
          attribute :ha_network_peers
          attribute :ha_statefiles
          attribute :hostname
          attribute :license_params
          attribute :license_server
          attribute :logging
          attribute :memory_overhead
          attribute :name,                                :aliases => :name_label
          attribute :other_config
          attribute :patches
          attribute :power_on_config
          attribute :power_on_mode
          attribute :sched_policy
          attribute :software_version
          attribute :supported_bootloaders
          attribute :suspend_image_sr
          attribute :tags
          attribute :uuid

          has_many_identities :crashdumps,    :crash_dumps
          has_one_identity    :crash_dump_sr, :storage_repositories
          has_many_identities :host_cpus,     :host_cpus,            :aliases => :host_CPUs,    :as => :host_CPUs
          has_one_identity    :local_cache_sr,:storage_repositories
          has_one_identity    :metrics,       :hosts_metrics
          has_many_identities :pbds,          :pbds,                 :aliases => :PBDs,         :as => :PBDs
          has_many_identities :pcis,          :pcis,                 :aliases => :PCIs,         :as => :PCIs
          has_many_identities :pgpus,         :pgpus,                :aliases => :PGPUs,        :as => :PGPUs
          has_many_identities :pifs,          :pifs,                 :aliases => :PIFs,         :as => :PIFs
          has_many_identities :resident_vms,  :servers,              :aliases => :resident_VMs, :as => :resident_VMs

          alias_method :resident_servers, :resident_vms
          
          methods = %w{
                      emergency_ha_disable list_methods local_management_reconfigure management_disable
                      management_reconfigure shutdown_agent
                    }

          # would be much simpler just call __callee__ on request without reference
          # instead of __method__ and set an alias for each method defined on
          # methods, just creating a method for each one, so we can keep compatability
          # with ruby 1.8.7 that does not have __callee__
          methods.each do |method|
            define_method(method.to_sym) { |*args| service.send("#{__method__}_#{provider_class.downcase}", *args) }
          end

          def shutdown(auto_disable = true)
            service.disable_host(reference) if auto_disable
            service.shutdown_host(reference)
          end

          def reboot(auto_disable = true)
            service.disable_host(reference) if auto_disable
            service.reboot_host(reference)
          end
        end
      end
    end
  end
end