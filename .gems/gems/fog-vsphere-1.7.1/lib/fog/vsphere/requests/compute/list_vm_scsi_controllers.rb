module Fog
  module Compute
    class Vsphere
      class Real
        def list_vm_scsi_controllers(vm_id)
          list_vm_scsi_controllers_raw(vm_id).map do |raw_controller|
            Fog::Compute::Vsphere::SCSIController.new(raw_controller)
          end
        end

        def list_vm_scsi_controllers_raw(vm_id)
          get_vm_ref(vm_id).config.hardware.device.grep(RbVmomi::VIM::VirtualSCSIController).map do |ctrl|
            {
              :type    => ctrl.class.to_s,
              :shared_bus  => ctrl.sharedBus.to_s,
              :unit_number => ctrl.scsiCtlrUnitNumber,
              :key => ctrl.key,
            }
          end
        end
      end
    end
  end
end
