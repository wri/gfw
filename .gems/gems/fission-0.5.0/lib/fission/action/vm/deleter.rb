module Fission
  module Action
    module VM

      class Deleter

        # Internal: Creates a new VMDeleter object.  This accepts a VM object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::VMDeleter.new @my_vm
        #
        # Returns a new VMDeleter object
        def initialize(vm)
          @vm = vm
        end

        # Public: Deletes a VM.  The VM must not be running in order to delete
        # it. As there are a number issues with the Fusion command line tool for
        # deleting VMs, this is a best effort.  The VM must not be running when
        # this method is called.  This essentially deletes the VM directory and
        # attempts to remove the relevant entries from the Fusion plist file.
        # It's highly recommended to delete VMs without the Fusion GUI running.
        # If the Fusion GUI is running this method should succeed, but it's
        # been observed that Fusion will recreate the plist data which is
        # deleted. This leads to 'missing' VMs in the Fusion GUI.
        #
        # Examples
        #
        #   @deleter.delete
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def delete
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          running_response = @vm.running?
          return running_response unless running_response.successful?

          if running_response.data
            message = 'The VM must not be running in order to delete it.'
            return Response.new :code => 1, :message => message
          end

          FileUtils.rm_rf @vm.path
          Metadata.delete_vm_info @vm.path

          Response.new :code => 0
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @deleter.vmrun_cmd
        #   # => "/foo/bar/vmrun -T fusion"
        #
        # Returns a String for the configured value of
        # Fission.config['vmrun_cmd'].
        def vmrun_cmd
          Fission.config['vmrun_cmd']
        end
      end

    end
  end
end
