module Fog
  module Compute
    class XenServer
      module Models
        class Bond < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=Bond

          provider_class :Bond
          collection_name :bonds

          identity :reference

          attribute :links_up
          attribute :mode
          attribute :other_config
          attribute :properties
          attribute :uuid

          has_one_identity    :master,          :pifs
          has_one_identity    :primary_slave,   :pifs
          has_many_identities :slaves,          :pifs
        end
      end
    end
  end
end