module Fog
  module Compute
    class Vsphere
      class Real
        def add_vm_controller(controller)
          vm_reconfig_hardware('instance_uuid' => controller.server_id, 'hardware_spec' => {'deviceChange'=>[create_controller(controller)]})
        end
      end

      class Mock
        def add_vm_controller(controller)
          vm_reconfig_hardware('instance_uuid' => controller.server_id, 'hardware_spec' => {'deviceChange'=>[create_controller(controller)]})
        end
      end
    end
  end
end
