module Fog
  module Compute
    class Vsphere
      class Real
        def list_virtual_machines(options = { })
          # Listing all VM's can be quite slow and expensive.  Try and optimize
          # based on the available options we have.  These conditions are in
          # ascending order of time to complete for large deployments.

          options[:folder] ||= options['folder']
          if options['instance_uuid'] then
            [get_virtual_machine(options['instance_uuid'])]
          elsif options[:folder] && options[:datacenter] then
            list_all_virtual_machines_in_folder(options[:folder], options[:datacenter], options[:recursive])
          else
            list_all_virtual_machines(options)
          end
        end


        private

        def list_all_virtual_machines_in_folder(path, datacenter_name, recursive)
          vms = raw_list_all_virtual_machines_in_folder(path, datacenter_name, recursive).to_a
          # remove all template based virtual machines
          vms.delete_if { |v| v.config.nil? or v.config.template }
          vms.map(&method(:convert_vm_mob_ref_to_attr_hash))
        end
        
        def raw_list_all_virtual_machines_in_folder(path, datacenter_name, recursive)
          folder = get_raw_vmfolder(path, datacenter_name)
          folder_enumerator(folder, recursive)
        end
        
        # An enumerator for a folder. Enumerates all the VMs in the folder, recursively if
        # passed recursive=true
        def folder_enumerator(raw_folder, recursive)
          Enumerator.new do |yielder|
            raw_folder.children.each do |child|
              case child
              when RbVmomi::VIM::Folder
                folder_enumerator(child, true).each {|item| yielder.yield item} if recursive
              when RbVmomi::VIM::VirtualMachine
                yielder.yield child
              end
            end
          end
        end
        
        def list_all_virtual_machines(options = { })
          raw_vms = raw_list_all_virtual_machines(options[:datacenter])
          vms = convert_vm_view_to_attr_hash(raw_vms)

          # remove all template based virtual machines
          vms.delete_if { |v| v['template'] }
          vms
        end

        def raw_list_all_virtual_machines(datacenter_name = nil)
          ## Moved this to its own function since trying to get a list of all virtual machines
          ## to parse for a find function took way too long. The raw list returned will make it
          ## much faster to interact for some functions.
          datacenters = find_datacenters(datacenter_name)
          datacenters.map do |dc|
            @connection.serviceContent.viewManager.CreateContainerView({
                                                                           :container  => dc.vmFolder,
                                                                           :type       =>  ["VirtualMachine"],
                                                                           :recursive  => true
                                                                       }).view
          end.flatten
        end
        def get_folder_path(folder, root = nil)
          if (not folder.methods.include?('parent')) or (folder == root)
            return
          end
          "#{get_folder_path(folder.parent)}/#{folder.name}"
        end
      end

      class Mock
        def get_folder_path(folder, root = nil)
          nil
        end

        def list_virtual_machines(options = { })
          if options['instance_uuid']
            server = self.data[:servers][options['instance_uuid']]
            server.nil? ? [] : [server]
          elsif options['mo_ref']
            self.data[:servers].values.select{|vm| vm['mo_ref'] == options['mo_ref']}
          elsif options[:folder] and options[:datacenter]
            self.data[:servers].values.select {|vm| vm['path'] == options[:folder] && vm['datacenter'] == options[:datacenter]}
          else
            options.delete('datacenter') # real code iterates if this is missing
            options.reject! {|k,v| v.nil? } # ignore options with nil value
            self.data[:servers].values.select {|vm| options.all? {|k,v| vm[k.to_s] == v.to_s }}
          end
        end
      end
    end
  end
end
