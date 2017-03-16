module Fog
  module Compute
    class XenServer
      module Models
        class Role < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=role

          provider_class :role
          collection_name :roles

          identity :reference

          attribute :description,         :aliases => :name_description
          attribute :name,                :aliases => :name_label
          attribute :uuid

          has_many_identities  :subroles,  :roles
        end
      end
    end
  end
end