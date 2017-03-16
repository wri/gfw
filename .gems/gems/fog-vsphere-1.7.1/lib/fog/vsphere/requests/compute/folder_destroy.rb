module Fog
  module Compute
    class Vsphere
      class Real
        def folder_destroy(path, datacenter_name)
          folder = get_raw_vmfolder(path, datacenter_name)
          raise Fog::Vsphere::Errors::NotFound, "No such folder #{path}" unless folder
          raise Fog::Vsphere::Errors::ServiceError, "Folder #{path} is not empty" if folder.childEntity.size > 0
          
          task = folder.Destroy_Task
          task.wait_for_completion
          { 'task_state' => task.info.state }
        end
      end
      class Mock
        def folder_destroy(path, datacenter_name)
          vms = list_virtual_machines(folder: path, datacenter: datacenter_name)
          if vms.length > 0
            raise Fog::Vsphere::Errors::ServiceError, "Folder #{path} is not empty"
          end
          { 'task_state' => 'success' }
        end
      end
    end
  end
end
