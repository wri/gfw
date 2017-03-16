module Fog
  module Compute
    class XenServer
      module Models
        class Network < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=network

          provider_class :network
          collection_name :networks

          identity :reference

          attribute :allowed_operations
          attribute :blobs
          attribute :bridge
          attribute :current_operations
          attribute :default_locking_mode
          attribute :description,         :aliases => :name_description,  :default => "",  :as => :name_description
          attribute :mtu,                 :aliases => :MTU,                                :as => :MTU
          attribute :name,                :aliases => :name_label,        :default => "",  :as => :name_label
          attribute :other_config,                                        :default => {}
          attribute :tags
          attribute :uuid

          has_many_identities :pifs,  :pifs,         :aliases => :PIFs,   :as => :PIFs
          has_many_identities :vifs,  :vifs,         :aliases => :VIFs,   :as => :VIFs

          require_before_save :name
        end
      end
    end
  end
end