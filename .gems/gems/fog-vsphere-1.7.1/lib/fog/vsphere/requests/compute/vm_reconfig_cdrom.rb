module Fog
  module Compute
    class Vsphere
      class Real
        def vm_reconfig_cdrom(options = {})
          raise ArgumentError, "instance_uuid is a required parameter" unless options.key? 'instance_uuid'
          # Attach iso / disattach
          if options.has_key?('iso')
            raise ArgumentError, "datastore is a required parameter" unless options.key? 'datastore'
            backing = RbVmomi::VIM::VirtualCdromIsoBackingInfo(
              fileName: "[#{options['datastore']}] #{options['iso']}"
            )
          else
            backing = RbVmomi::VIM::VirtualCdromRemoteAtapiBackingInfo(deviceName: '')
          end
          cdrom_obj = get_vm_ref(options['instance_uuid']).config.hardware.device.grep(RbVmomi::VIM::VirtualCdrom).first
          hardware_spec = {
            deviceChange: [{
              operation: :edit,
              device: RbVmomi::VIM::VirtualCdrom(
                backing: backing,
                key: cdrom_obj.key,
                controllerKey: cdrom_obj.controllerKey,
                connectable: RbVmomi::VIM::VirtualDeviceConnectInfo(
                  startConnected: options['start_connected'] || false,
                  connected: options['connected'] || false,
                  allowGuestControl: options['allow_guest_control'] || true,
                )
              )
            }]
          }
          vm_reconfig_hardware('instance_uuid' => options['instance_uuid'], 'hardware_spec' => hardware_spec )
        end
      end

      class Mock
        def vm_reconfig_cdrom(options = {})
          raise ArgumentError, "instance_uuid is a required parameter" unless options.key? 'instance_uuid'
          if options.has_key?('iso')
            raise ArgumentError, "datastore is a required parameter" unless options.key? 'datastore'
            backing = {
              fileName: "[#{options['datastore']}] #{options['iso']}"
            }
          else
            backing = {deviceName: ''}
          end
          cdrom_obj = list_vm_cdroms(options['instance_uuid']).first
          hardware_spec = {
            deviceChange: [{
              operation: :edit,
              device: {
                backing: backing,
                key: cdrom_obj['key'],
                controllerKey: cdrom_obj['controllerKey'],
                connectable: {
                  startConnected: options['start_connected'] || false,
                  connected: options['connected'] || false,
                  allowGuestControl: options['allow_guest_control'] || true,
                }
              }
            }]
          }
          vm_reconfig_hardware('instance_uuid' => options['instance_uuid'], 'hardware_spec' => hardware_spec )
        end
      end
    end
  end
end
