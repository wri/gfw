module Fog
  module Compute
    class Vsphere
      class Real
        def create_vm attributes = { }
          # build up vm configuration

          vm_cfg        = {
            :name         => attributes[:name],
            :annotation   => attributes[:annotation],
            :guestId      => attributes[:guest_id],
            :version      => attributes[:hardware_version],
            :files        => { :vmPathName => vm_path_name(attributes) },
            :numCPUs      => attributes[:cpus],
            :numCoresPerSocket => attributes[:corespersocket],
            :memoryMB     => attributes[:memory_mb],
            :deviceChange => device_change(attributes),
            :extraConfig  => extra_config(attributes),
          }
          vm_cfg[:cpuHotAddEnabled] = attributes[:cpuHotAddEnabled] if attributes.key?(:cpuHotAddEnabled)
          vm_cfg[:memoryHotAddEnabled] = attributes[:memoryHotAddEnabled] if attributes.key?(:memoryHotAddEnabled)
          vm_cfg[:firmware] = attributes[:firmware] if attributes.key?(:firmware)
          vm_cfg[:bootOptions] = boot_options(attributes, vm_cfg) if attributes.key?(:boot_order) || attributes.key?(:boot_retry)
          resource_pool = if attributes[:resource_pool] && attributes[:resource_pool] != 'Resources'
                            get_raw_resource_pool(attributes[:resource_pool], attributes[:cluster], attributes[:datacenter])
                          else
                            get_raw_cluster(attributes[:cluster], attributes[:datacenter]).resourcePool
                          end
          vmFolder      = get_raw_vmfolder(attributes[:path], attributes[:datacenter])
          if attributes.key?(:host)
            host = get_raw_host(attributes[:host], attributes[:cluster], attributes[:datacenter])
          else
            host = nil
          end
          # if any volume has a storage_pod set, we deploy the vm on a storage pod instead of the defined datastores
          pod = get_storage_pod(attributes)
          if pod
            vm = create_vm_on_storage_pod(pod, vm_cfg, vmFolder, resource_pool, attributes[:datacenter], host)
          else
            vm = create_vm_on_datastore(vm_cfg, vmFolder, resource_pool, host)
          end
          vm.config.instanceUuid
        end

        private

        def create_vm_on_datastore(vm_cfg, vmFolder, resource_pool, host = nil)
          vm = vmFolder.CreateVM_Task(:config => vm_cfg, :pool => resource_pool, :host => host).wait_for_completion
        end

        def create_vm_on_storage_pod(storage_pod, vm_cfg, vmFolder, resource_pool, datacenter, host = nil)
          pod_spec     = RbVmomi::VIM::StorageDrsPodSelectionSpec.new(
            :storagePod => get_raw_storage_pod(storage_pod, datacenter),
          )
          storage_spec = RbVmomi::VIM::StoragePlacementSpec.new(
            :type => 'create',
            :folder => vmFolder,
            :resourcePool => resource_pool,
            :podSelectionSpec => pod_spec,
            :configSpec => vm_cfg,
            :host => host,
          )
          srm = @connection.serviceContent.storageResourceManager
          result = srm.RecommendDatastores(:storageSpec => storage_spec)

          # if result array contains recommendation, we can apply it
          if key = result.recommendations.first.key
            result = srm.ApplyStorageDrsRecommendation_Task(:key => [key]).wait_for_completion
            vm = result.vm
          else
            raise "Could not create vm on storage pod, did not get a storage recommendation"
          end
          vm
        end

        # check if a storage pool is set on any of the volumes and return the first result found or nil
        # return early if vsphere revision is lower than 5 as this is not supported
        def get_storage_pod attributes
          return unless @vsphere_rev.to_f >= 5
          volume = attributes[:volumes].detect {|volume| !( volume.storage_pod.nil? || volume.storage_pod.empty? ) }
          volume.storage_pod if volume
        end

        # this methods defines where the vm config files would be located,
        # by default we prefer to keep it at the same place the (first) vmdk is located
        # if we deploy the vm on a storage pool, we have to return an empty string
        def vm_path_name attributes
          return '' if get_storage_pod(attributes)
          datastore = attributes[:volumes].first.datastore unless attributes[:volumes].empty?
          datastore ||= 'datastore1'
          "[#{datastore}]"
        end

        def device_change attributes
          devices = []
          if (nics = attributes[:interfaces])
            devices << nics.map { |nic| create_interface(nic, nics.index(nic), :add, attributes) }
          end

          if (scsi_controllers = (attributes[:scsi_controllers] || attributes["scsi_controller"]))
            devices << scsi_controllers.each_with_index.map { |controller, index| create_controller(controller, index) }
          end

          if (disks = attributes[:volumes])
            devices << disks.map { |disk| create_disk(disk, :add, get_storage_pod(attributes)) }
          end

          if (cdroms = attributes[:cdroms])
            devices << cdroms.map { |cdrom| create_cdrom(cdrom, cdroms.index(cdrom)) }
          end
          devices.flatten
        end

        def boot_options(attributes, vm_cfg)
          # NOTE: you must be using vsphere_rev 5.0 or greater to set boot_order
          # e.g. Fog::Compute.new(provider: "vsphere", vsphere_rev: "5.5", etc)
          options = {}
          if @vsphere_rev.to_f >= 5 and attributes[:boot_order]
            options[:bootOrder] = boot_order(attributes, vm_cfg)
          end

          # Set attributes[:boot_retry] to a delay in miliseconds to enable boot retries
          if attributes[:boot_retry]
            options[:bootRetryEnabled] = true
            options[:bootRetryDelay]   = attributes[:boot_retry]
          end

          options.empty? ? nil : RbVmomi::VIM::VirtualMachineBootOptions.new(options)
        end

        def boot_order(attributes, vm_cfg)
          # attributes[:boot_order] may be an array like this ['network', 'disk']
          # stating, that we want to prefer network boots over disk boots
          boot_order = []
          attributes[:boot_order].each do |boot_device|
            case boot_device
            when 'network'
              if nics = attributes[:interfaces]
                # key is based on 4000 + the interface index
                # we allow booting from all network interfaces, the first interface has the highest priority
                nics.each do |nic|
                  boot_order << RbVmomi::VIM::VirtualMachineBootOptionsBootableEthernetDevice.new(
                    :deviceKey => 4000 + nics.index(nic),
                  )
                end
              end
            when 'disk'
              disks = vm_cfg[:deviceChange].map {|dev| dev[:device]}.select { |dev| dev.is_a? RbVmomi::VIM::VirtualDisk }
              disks.each do |disk|
                # we allow booting from all harddisks, the first disk has the highest priority
                boot_order << RbVmomi::VIM::VirtualMachineBootOptionsBootableDiskDevice.new(
                  :deviceKey => disk.key
                )
              end
            when 'cdrom'
              boot_order << RbVmomi::VIM::VirtualMachineBootOptionsBootableCdromDevice.new
            when 'floppy'
              boot_order << RbVmomi::VIM::VirtualMachineBootOptionsBootableFloppyDevice.new
            else
              raise "failed to create boot device because \"#{boot_device}\" is unknown"
            end
          end
          boot_order
        end

        def create_nic_backing nic, attributes
          raw_network = get_raw_network(nic.network, attributes[:datacenter], if nic.virtualswitch then nic.virtualswitch end)

          if raw_network.kind_of? RbVmomi::VIM::DistributedVirtualPortgroup
            RbVmomi::VIM.VirtualEthernetCardDistributedVirtualPortBackingInfo(
              :port => RbVmomi::VIM.DistributedVirtualSwitchPortConnection(
                :portgroupKey => raw_network.key,
                :switchUuid   => raw_network.config.distributedVirtualSwitch.uuid
              )
            )
          else
            RbVmomi::VIM.VirtualEthernetCardNetworkBackingInfo(:deviceName => nic.network)
          end
        end

        def create_interface nic, index = 0, operation = :add, attributes = {}
          {
            :operation => operation,
            :device    => nic.type.new(
              :key         => index,
              :deviceInfo  =>
                {
                  :label   => nic.name,
                  :summary => nic.summary,
                },
              :backing     => create_nic_backing(nic, attributes),
              :addressType => 'generated')
          }
        end

        def create_controller(controller=nil, index = 0)
          options=if controller
                    controller_default_options.merge(controller.attributes)
                  else
                    controller_default_options
                  end
          controller_class=if options[:type].is_a? String then
                             Fog::Vsphere.class_from_string options[:type], "RbVmomi::VIM"
                           else
                             options[:type]
                           end
          {
            :operation => options[:operation],
            :device    => controller_class.new({
              :key       => options[:key] || (1000 + index),
              :busNumber => options[:bus_id] || index,
              :sharedBus => controller_get_shared_from_options(options),
            })
          }
        end

        def controller_default_options
          {:operation => :add, :type => RbVmomi::VIM.VirtualLsiLogicController.class, :shared => false }
        end

        def controller_get_shared_from_options options
          if (options.key? :shared and options[:shared]==false) or not options.key? :shared then
            :noSharing
          elsif options[:shared]==true then
            :virtualSharing
          elsif options[:shared].is_a? String
            options[:shared]
          else
            :noSharing
          end
        end

        def create_disk(disk, operation = :add, storage_pod = nil)
          # If we deploy the vm on a storage pod, datastore has to be an empty string
          if storage_pod
            datastore = ''
          else
            datastore = "[#{disk.datastore}]"
          end

          disk.set_unit_number
          disk.set_key

          payload = {
            :operation     => operation,
            :fileOperation => operation == :add ? :create : :destroy,
            :device        => RbVmomi::VIM.VirtualDisk(
              :key           => disk.key,
              :backing       => RbVmomi::VIM.VirtualDiskFlatVer2BackingInfo(
                :fileName        => datastore,
                :diskMode        => disk.mode.to_sym,
                :thinProvisioned => disk.thin
              ),
              :controllerKey => disk.controller_key,
              :unitNumber    => disk.unit_number,
              :capacityInKB  => disk.size
            )
          }

          if operation == :add && disk.thin == 'false' && disk.eager_zero == 'true'
            payload[:device][:backing][:eagerlyScrub] = disk.eager_zero
          end

          payload
        end

        def create_cdrom cdrom, index = 0, operation = :add, controller_key = 200
          {
            :operation     => operation,
            :device        => RbVmomi::VIM.VirtualCdrom(
              :key           => cdrom.key || index,
              :backing       => RbVmomi::VIM::VirtualCdromRemoteAtapiBackingInfo(deviceName: ''),
              :controllerKey => controller_key,
              connectable: RbVmomi::VIM::VirtualDeviceConnectInfo(
                startConnected: false,
                connected: false,
                allowGuestControl: true,
              ),
            )
          }
        end

        def extra_config attributes
          extra_config = attributes[:extra_config] || {'bios.bootOrder' => 'ethernet0'}
          extra_config.map {|k,v| {:key => k, :value => v.to_s} }
        end
      end

      class Mock
        def create_vm attributes = { }
          id = SecureRandom.uuid
          vm = {
            'id'                => id,
            'uuid'              => id,
            'instance_uuid'     => id,
            'mo_ref'            => "vm-#{rand 99999}",
            'datacenter'        => attributes[:datacenter],
            'name'              => attributes[:name],
            'interfaces'        => attributes[:interfaces].map {{
              'mac' => 'f2:b5:46:b5:d8:d7'
            }}
          }
          self.data[:servers][id] = vm
          id
        end

        def create_cdrom cdrom, index = 0, operation = :add, controller_key = 200
          {
            :operation     => operation,
            :device        => {
              :key           => cdrom.key || index,
              :backing       => { deviceName: '' },
              :controllerKey => controller_key,
              connectable: {
                startConnected: false,
                connected: false,
                allowGuestControl: true,
              },
            }
          }
        end
      end
    end
  end
end
