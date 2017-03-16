module Fog
  module Compute
    class XenServer
      module Models
        class StorageRepository < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=SR

          provider_class :SR
          collection_name :storage_repositories

          identity :reference

          attribute :allowed_operations
          attribute :blobs
          attribute :content_type,                                          :default => "user"
          attribute :current_operations
          attribute :description,          :aliases => :name_description,   :default => ""
          attribute :introduced_by
          attribute :local_cache_enabled
          attribute :name,                 :aliases => :name_label
          attribute :other_config
          attribute :physical_size,                                         :default => "0"
          attribute :physical_utilisation
          attribute :shared,                                                :default => false
          attribute :sm_config,                                             :default => {}
          attribute :tags
          attribute :type
          attribute :uuid
          attribute :virtual_allocation

          has_many_identities  :pbds,  :pbds,         :aliases => :PBDs,  :as => :PBDs
          has_many_identities  :vdis,  :vdis,         :aliases => :VDIs,  :as => :VDIs

          require_before_save :name, :type

          methods = %w{ get_supported_types introduce probe }

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