module Fog
  module Compute
    class XenServer
      module Models
        class StorageManager < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=SM

          provider_class :SM
          collection_name :storage_managers

          identity :reference

          attribute :capabilities
          attribute :configuration
          attribute :copyright
          attribute :description,               :aliases => :name_description
          attribute :driver_filename
          attribute :features
          attribute :name,                      :aliases => :name_label
          attribute :other_config
          attribute :required_api_version
          attribute :type
          attribute :uuid
          attribute :vendor
          attribute :version
        end
      end
    end
  end
end