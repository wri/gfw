module Fog
  module Compute
    class Vsphere
      class Real
        def add_vm_interface(vmid, options = {})
          raise ArgumentError, "instance id is a required parameter" unless vmid

          interface = get_interface_from_options(vmid, options.merge(:server_id => vmid))
          vm_reconfig_hardware('instance_uuid' => vmid, 'hardware_spec' => {'deviceChange'=>[create_interface(interface, 0, :add, options)]})
        end

        def destroy_vm_interface(vmid, options = {})
          raise ArgumentError, "instance id is a required parameter" unless vmid

          interface = get_interface_from_options(vmid, options.merge(:server_id => vmid))
          vm_reconfig_hardware('instance_uuid' => vmid, 'hardware_spec' => {'deviceChange'=>[create_interface(interface, interface.key, :remove)]})
        end

        def update_vm_interface(vmid, options = {})
          raise ArgumentError, "instance id is a required parameter" unless vmid

          interface = get_interface_from_options(vmid, options)
          raw_interface = get_raw_interface(vmid, key: interface.key)
          if options[:network]
            interface.network = options[:network]
            backing = create_nic_backing(interface, {})
            raw_interface.backing = backing
          end
          spec = {
            operation: :edit,
            device: raw_interface
          }          
          vm_reconfig_hardware('instance_uuid' => vmid, 'hardware_spec' => {'deviceChange'=>[spec]})
        end

        private
        
        def get_interface_from_options(vmid, options)
          if options and options[:interface]
            options[:interface]

          elsif options[:key] and options[:key]>0
            oldattributes = get_vm_interface(vmid, options)
            Fog::Compute::Vsphere::Interface.new(oldattributes.merge(options))

          elsif options[:type] and options[:network]
            Fog::Compute::Vsphere::Interface.new options

          else
            raise ArgumentError, "interface is a required parameter or pass options with type and network"
          end
        end
      end

      class Mock
        def add_vm_interface(vmid, options = {})
          raise ArgumentError, "instance id is a required parameter" unless vmid
          raise ArgumentError, "interface is a required parameter" unless options and options[:interface]
          true
        end

        def destroy_vm_interface(vmid, options = {})
          raise ArgumentError, "instance id is a required parameter" unless vmid
          raise ArgumentError, "interface is a required parameter" unless options and options[:interface]
          true
        end
        
        def update_vm_interface(vmid, options = {})
          return unless options[:interface]
          options[:interface].network = options[:network]
          options[:interface].type    = options[:type]
        end
      end
    end
  end
end
