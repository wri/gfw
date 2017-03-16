module Fog
  module Compute
    class XenServer
      module Models
        class PoolPatch < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=pool_patch

          provider_class :pool_patch
          collection_name :pool_patchs

          identity :reference

          attribute :after_apply_guidance
          attribute :description,             :aliases => :name_description
          attribute :name,                    :aliases => :name_label
          attribute :other_config
          attribute :pool_applied
          attribute :size
          attribute :uuid
          attribute :version

          has_many_identities  :host_patches,    :host_patchs
        end
      end
    end
  end
end