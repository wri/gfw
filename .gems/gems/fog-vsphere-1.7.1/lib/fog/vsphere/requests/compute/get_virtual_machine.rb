module Fog
  module Compute
    class Vsphere
      class Real
        def get_virtual_machine(id, datacenter_name = nil, folder = nil, recursive = false)
          # The larger the VM list the longer it will take if not searching based on UUID.
          convert_vm_mob_ref_to_attr_hash(get_vm_ref(id, datacenter_name, folder, recursive))
        end

        protected

        def get_vm_ref(id, dc = nil, folder = nil, recursive = false)
          raw_datacenter = find_raw_datacenter(dc) if dc
          vm = case is_uuid?(id)
                 # UUID based
                 when true
                   params = {:uuid => id, :vmSearch => true, :instanceUuid => true}
                   params[:datacenter] = raw_datacenter if dc
                   @connection.searchIndex.FindByUuid(params)
                 else
                   # try to find based on VM name
                   if dc
                     get_vm_by_name(id, dc, folder, recursive)
                   else
                     raw_datacenters.map { |d| get_vm_by_name(id, d["name"], folder, recursive)}.compact.first
                   end
               end
          vm ? vm : raise(Fog::Compute::Vsphere::NotFound, "#{id} was not found")
        end

        def get_vm_by_name(name, dc, folder, recursive)
          if folder
            # This returns an Enumerator, which when called with .find will
            # search only until it finds the VM we're looking for
            vms = raw_list_all_virtual_machines_in_folder(folder, dc, recursive)
          else
            vms = raw_list_all_virtual_machines(dc)
          end

          if name.include?('/')
            folder = File.dirname(name)
            basename = File.basename(name)
            vms.find do |v|
              begin
                v["name"] == basename && v.parent.pretty_path.include?(folder)
              rescue RbVmomi::VIM::ManagedObjectNotFound
                false
              end
            end
          else
            vms.find do |v|
              begin
                v["name"] == name
              rescue RbVmomi::VIM::ManagedObjectNotFound
                false
              end
            end
          end
        end
      end

      class Mock
        def get_virtual_machine(id, datacenter_name = nil, folder = nil, recursive = false)
          if is_uuid?(id)
            vm = list_virtual_machines({ 'instance_uuid' => id, 'datacenter' => datacenter_name }).first
          else
            # try to find based on VM name. May need to handle the path of the VM
            vm = list_virtual_machines({ 'name' => id, 'datacenter' => datacenter_name }).first
          end
          vm ? vm : raise(Fog::Compute::Vsphere::NotFound, "#{id} was not found")
        end
      end
    end
  end
end
