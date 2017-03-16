module Fog
  module Compute
    class XenServer
      module Models
        class Blob < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=blob

          provider_class :blob
          collection_name :blobs

          identity :reference

          attribute :description,         :aliases => :name_description
          attribute :last_updated
          attribute :mime_type
          attribute :name,                :aliases => :name_label
          attribute :public
          attribute :size
          attribute :uuid
        end
      end
    end
  end
end