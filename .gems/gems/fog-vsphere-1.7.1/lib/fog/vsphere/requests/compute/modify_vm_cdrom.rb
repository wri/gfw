module Fog
  module Compute
    class Vsphere
      class Real
        def add_vm_cdrom(cdrom)
          vm_reconfig_hardware('instance_uuid' => cdrom.server.instance_uuid, 'hardware_spec' => {'deviceChange'=>[create_cdrom(cdrom, cdrom.unit_number, :add)]})
        end

        def destroy_vm_cdrom(cdrom)
          vm_reconfig_hardware('instance_uuid' => cdrom.server.instance_uuid, 'hardware_spec' => {'deviceChange'=>[create_cdrom(cdrom, cdrom.unit_number, :remove)]})
        end
      end

      class Mock
        def add_vm_cdrom(cdrom)
          vm_reconfig_hardware('instance_uuid' => cdrom.server.instance_uuid, 'hardware_spec' => {'deviceChange'=>[create_cdrom(cdrom, cdrom.unit_number, :add)]})
        end

        def destroy_vm_cdrom(cdrom)
          vm_reconfig_hardware('instance_uuid' => cdrom.server.instance_uuid, 'hardware_spec' => {'deviceChange'=>[create_cdrom(cdrom, cdrom.unit_number, :remove)]})
        end
      end
    end
  end
end
