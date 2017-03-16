module Fog
  module Compute
    class Vsphere
      class Cdroms < Fog::Collection
        attribute :instance_uuid, :alias => :server_id
        model Fog::Compute::Vsphere::Cdrom

        def all(filters = {})
          load service.list_vm_cdroms(instance_uuid)
        end

        def get(unit_number)
          all.find { |cdrom| cdrom.unit_number == unit_number }
        end
      end
    end
  end
end
