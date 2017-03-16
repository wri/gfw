module Fog
  module Compute
    class XenServer
      module Models
        class Vtpm < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=VTPM

          provider_class :VTPM
          collection_name :vtpms

          identity :reference

          attribute :uuid

          has_one_identity  :backend,  :servers
          has_one_identity  :vm,       :servers
        end
      end
    end
  end
end