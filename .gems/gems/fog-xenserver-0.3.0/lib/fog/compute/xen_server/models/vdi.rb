module Fog
  module Compute
    class XenServer
      module Models
        class Vdi < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VDI

          provider_class :VDI
          collection_name :vdis

          identity :reference

          attribute :allowed_operations
          attribute :allow_caching
          attribute :current_operations
          attribute :description,                 :aliases => :name_description,    :as => :name_description
          attribute :is_a_snapshot
          attribute :location
          attribute :managed
          attribute :metadata_latest
          attribute :metadata_of_pool
          attribute :missing
          attribute :name,                        :aliases => :name_label,          :as => :name_label
          attribute :on_boot
          attribute :other_config,                :default => {}
          attribute :physical_utilisation
          attribute :read_only,                   :default => false
          attribute :sharable,                    :default => false
          attribute :sm_config
          attribute :snapshot_time
          attribute :storage_lock
          attribute :tags
          attribute :type,                        :default => "system"
          attribute :uuid
          attribute :virtual_size,                :default => "8589934592"
          attribute :xenstore_data

          has_many_identities   :crash_dumps,  :crash_dumps
          has_one_identity      :parent,       :vdis
          has_many_identities   :snapshots,    :vdis
          has_one_identity      :snapshot_of,  :vdis
          has_one_identity      :sr,           :storage_repositories,      :aliases => :SR,   :as => :SR
          has_many_identities   :vbds,         :vbds,                      :aliases => :VBDs, :as => :VBDs

          require_before_save :name, :storage_repository, :type

          alias_method :storage_repository, :sr
          alias_method :storage_repository=, :sr=

          def can_be_destroyed?
            allowed_operations.include?("destroy")
          end

          def destroy
            return service.destroy_record(reference, provider_class) if can_be_destroyed?
            false
          end
        end
      end
    end
  end
end