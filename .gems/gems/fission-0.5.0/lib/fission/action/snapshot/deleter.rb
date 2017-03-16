module Fission
  module Action
    module Snapshot

      class Deleter

        # Internal: Creates a new SnapshotDeleter object.  This accepts a VM
        # object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::SnapshotDeleter.new @my_vm
        #
        # Returns a new SnapshotDeleter object
        def initialize(vm)
          @vm = vm
        end

        # Public: Deletes a snapshot for a VM.  The snapshot to delete must
        # exist. If the Fusion GUI is running, then the VM must also be running.
        #
        # name - The name of the snapshot to delete.
        #
        # Examples
        #
        #   @deleter.delete_snapshot('foo_snap_1')
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def delete_snapshot(name)
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          if Fusion.running?
            running_response = @vm.running?
            return running_response unless running_response.successful?

            unless running_response.data
              message = 'A snapshot cannot be deleted when the GUI is running '
              message << 'and the VM is not running.'
              return Response.new :code => 1, :message => message
            end
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          snapshots_response = @vm.snapshots
          return snapshots_response unless snapshots_response.successful?

          unless snapshots_response.data.include? name
            message = "Unable to find a snapshot named '#{name}'."
            return Response.new :code => 1, :message => message
          end

          command = "#{vmrun_cmd} deleteSnapshot "
          command << "'#{conf_file_response.data}' \"#{name}\" 2>&1"

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
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
