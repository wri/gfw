module Fog
  module Compute
    class Vsphere
      class Real
        def add_vm_volume(volume)
          vm_reconfig_hardware('instance_uuid' => volume.server_id, 'hardware_spec' => {'deviceChange'=>[create_disk(volume, :add)]})
        end

        def destroy_vm_volume(volume)
          vm_reconfig_hardware('instance_uuid' => volume.server_id, 'hardware_spec' => {'deviceChange'=>[create_disk(volume, :remove)]})
        end
      end

      class Mock
        def add_vm_volume(volume)
          vm_reconfig_hardware('instance_uuid' => volume.server_id, 'hardware_spec' => {'deviceChange'=>[create_cdrom(volume, :add)]})
        end

        def destroy_vm_volume(volume)
          true
        end
      end
    end
  end
end
