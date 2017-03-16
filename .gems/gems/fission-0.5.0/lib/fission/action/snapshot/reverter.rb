module Fission
  module Action
    module Snapshot

      class Reverter

        # Internal: Creates a new SnapshotReverter object.  This accepts a VM
        # object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::SnapshotReverter.new @my_vm
        #
        # Returns a new SnapshotReverter object
        def initialize(vm)
          @vm = vm
        end

        # Public: Reverts the VM to the specified snapshot.  The snapshot to
        # revert to must exist and the Fusion GUI must not be running.
        #
        # name - The snapshot name to revert to.
        #
        # Examples
        #
        #   @reverter.revert_to_snapshot('foo_snap_1')
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def revert_to_snapshot(name)
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          if Fusion.running?
            message = 'It looks like the Fusion GUI is currently running.  '
            message << 'A VM cannot be reverted to a snapshot when the Fusion GUI is running.  '
            message << 'Exit the Fusion GUI and try again.'
            return Response.new :code => 1, :message => message
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          snapshots_response = @vm.snapshots
          return snapshots_response unless snapshots_response.successful?

          unless snapshots_response.data.include? name
            message = "Unable to find a snapshot named '#{name}'."
            return Response.new :code => 1, :message => message
          end

          command = "#{vmrun_cmd} revertToSnapshot "
          command << "'#{conf_file_response.data}' \"#{name}\" 2>&1"

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @reverter.vmrun_cmd
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
