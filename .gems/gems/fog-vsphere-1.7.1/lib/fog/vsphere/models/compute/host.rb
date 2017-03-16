module Fog
  module Compute
    class Vsphere
      class Host < Fog::Model
        identity :name

        attribute :datacenter
        attribute :cluster
        attribute :name
        attribute :vm_ids

        def to_s
          name
        end
      end
    end
  end
end
