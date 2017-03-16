module Fog
  module Compute
    class Vsphere
      class StoragePod < Fog::Model
        identity :id

        attribute :name
        attribute :datacenter
        attribute :type
        attribute :freespace
        attribute :capacity

        def to_s
          name
        end
      end
    end
  end
end
