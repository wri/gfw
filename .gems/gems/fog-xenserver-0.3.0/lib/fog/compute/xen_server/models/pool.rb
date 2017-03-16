module Fog
  module Compute
    class XenServer
      module Models
        class Pool < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=pool

          provider_class :pool
          collection_name :pools

          identity :reference

          attribute :blobs
          attribute :description,            :aliases => :name_description
          attribute :gui_config
          attribute :ha_allow_overcommit
          attribute :ha_configuration
          attribute :ha_enabled
          attribute :ha_host_failures_to_tolerate
          attribute :ha_overcommitted
          attribute :ha_plan_exists_for
          attribute :ha_statefiles
          attribute :name,                   :aliases => :name_label
          attribute :other_config
          attribute :redo_log_enabled
          attribute :redo_log_vdi
          attribute :restrictions
          attribute :tags
          attribute :uuid
          attribute :vswitch_controller
          attribute :wlb_enabled
          attribute :wlb_url
          attribute :wlb_username
          attribute :wlb_verify_cert

          has_one_identity    :crash_dump_sr,    :storage_repositories,   :aliases => :crash_dump_SR,     :as => :crash_dump_SR
          has_one_identity    :default_sr,       :storage_repositories,   :aliases => :default_SR,        :as => :default_SR
          has_one_identity    :master,           :hosts
          has_many_identities :metadata_vdis,    :vdis,                   :aliases => :metadata_VDIs,     :as => :metadata_VDIs
          has_one_identity    :suspend_image_sr, :storage_repositories,   :aliases => :suspend_image_SR,  :as => :suspend_image_SR

          alias_method :default_storage_repository, :default_sr
          methods = %w{
                      certificate_install certificate_list certificate_sync certificate_uninstall create_vlan \
                      create_vlan_from_pif crl_install crl_list crl_uninstall designate_new_master disable_ha \
                      disable_redo_log emergency_reset_master emergency_transition_to_master enable_ha \
                      enable_redo_log ha_compute_hypothetical_max_host_failures_to_tolerate \
                      ha_compute_max_host_failures_to_tolerate ha_compute_vm_failover_plan \
                      ha_failover_plan_exists ha_prevent_restarts_for join join_force recover_slaves \
                      send_test_post set_vswitch_controller sync_database
                    }

          # would be much simpler just call __callee__ on request without reference
          # instead of __method__ and set an alias for each method defined on
          # methods, just creating a method for each one, so we can keep compatability
          # with ruby 1.8.7 that does not have __callee__
          methods.each do |method|
            define_method(method.to_sym) { |*args| service.send("#{__method__}_#{provider_class.downcase}", *args) }
          end
        end
      end
    end
  end
end