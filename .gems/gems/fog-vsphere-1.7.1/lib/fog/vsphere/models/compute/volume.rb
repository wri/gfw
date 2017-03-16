module Fog
  module Compute
    class Vsphere
      class Volume < Fog::Model
        DISK_SIZE_TO_GB = 1048576
        identity :id

        has_one :server, Server
        attribute :datastore
        attribute :storage_pod
        attribute :mode
        attribute :size
        attribute :thin
        attribute :eager_zero
        attribute :name
        attribute :filename
        attribute :size_gb
        attribute :key
        attribute :unit_number
        attribute :controller_key, :type => :integer

        def initialize(attributes={})
          super defaults.merge(attributes)
        end

        def size_gb
          attributes[:size_gb] ||= attributes[:size].to_i / DISK_SIZE_TO_GB if attributes[:size]
        end

        def size_gb= s
          attributes[:size] = s.to_i * DISK_SIZE_TO_GB if s
          attributes[:size_gb] = s.to_i if s
        end

        def to_s
          name
        end

        def destroy
          requires :server_id, :key, :unit_number

          service.destroy_vm_volume(self)
          true
        end

        def save
          raise Fog::Errors::Error.new('Resaving an existing object may create a duplicate') if persisted?
          requires :server_id, :size, :datastore

          set_unit_number

          data = service.add_vm_volume(self)

          if data['task_state'] == 'success'
            if self.unit_number >= 7
              self.unit_number += 1
            end

            # We have to query vSphere to get the volume attributes since the task handle doesn't include that info.
            created = server.volumes.all.find { |volume| volume.unit_number == self.unit_number }

            # example of "created" =>
            #   <Fog::Compute::Vsphere::Volume
            #     id="6000C295-576f-0e2d-5b70-c778cd108b3a",
            #     datastore="datastore1",
            #     storage_pod=nil,
            #     mode="persistent",
            #     size=10485760,
            #     thin=true,
            #     eager_zero=nil,
            #     name="Hard disk 2",
            #     filename="[datastore1] testvm/testvm_2.vmdk",
            #     size_gb=10,
            #     key=2004,
            #     unit_number=2,
            #     controller_key=1000
            #   >
            self.id = created.id
            self.key = created.key
            self.controller_key = created.controller_key
            self.filename = created.filename

            true
          else
            false
          end
        end

        def server_id
          requires :server
          server.id
        end

        def set_unit_number
          # When adding volumes to vsphere, if our unit_number is 7 or higher, vsphere will increment the unit_number
          # This is due to SCSI ID 7 being reserved for the pvscsi controller
          # When referring to a volume that already added using a unit_id of 7 or higher, we must refer to the actual SCSI ID
          if unit_number.nil?
            self.unit_number = calculate_free_unit_number
          else
            if server.volumes.select { |vol| vol.controller_key == controller_key }.any? { |volume| volume.unit_number == self.unit_number && volume.id != self.id }
              raise "A volume already exists with that unit_number, so we can't save the new volume"
            end
          end
        end

        def set_key
          requires :controller_key, :unit_number

          return unless key.nil?

          # controller key is based on 1000 + controller bus
          # disk key is based on 2000 + the SCSI ID + the controller bus * 16
          controller_bus = controller_key - 1000
          self.key = 2000 + (controller_bus * 16) + unit_number
        end

        private

        def defaults
          {
            :thin => true,
            :name => "Hard disk",
            :mode => "persistent",
            :controller_key => 1000
          }
        end

        def calculate_free_unit_number
          requires :controller_key

          # Vsphere maps unit_numbers 7 and greater to a higher SCSI ID since the pvscsi driver reserves SCSI ID 7
          used_unit_numbers = server.volumes
            .select { |vol| vol.unit_number && vol.controller_key == controller_key }.map(&:unit_number) + [7]
          free_unit_numbers = (0..15).to_a - used_unit_numbers

          free_unit_numbers.first
        end
      end
    end
  end
end
