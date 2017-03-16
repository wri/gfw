module Fission
  module Action
    module Snapshot

      class Creator

        # Internal: Creates a new SnapshotCreator object.  This accepts a VM
        # object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::SnapshotCreator.new @my_vm
        #
        # Returns a new SnapshotCreator object
        def initialize(vm)
          @vm = vm
        end

        # Public: Creates a snapshot for a VM.  The VM must be running in order
        # to create a snapshot.  Snapshot names must be unique.
        #
        # name - The desired name of the snapshot.  The name must be unique.
        #
        # Examples
        #
        #   @creator.create_snapshot('foo_snap_1')
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def create_snapshot(name)
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          running_response = @vm.running?
          return running_response unless running_response.successful?

          unless running_response.data
            message = 'The VM must be running in order to take a snapshot.'
            return Response.new :code => 1, :message => message
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          snapshots_response = @vm.snapshots
          return snapshots_response unless snapshots_response.successful?

          if snapshots_response.data.include? name
            message = "There is already a snapshot named '#{name}'."
            return Response.new :code => 1, :message => message
          end

          command = "#{vmrun_cmd} snapshot "
          command << "'#{conf_file_response.data}' \"#{name}\" 2>&1"

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @creator.vmrun_cmd
        #   # => "/foo/bar/vmrun -T fusion"
        #
        # Returns a String for the configured value of Fission.config['vmrun_cmd'].
        def vmrun_cmd
          Fission.config['vmrun_cmd']
        end

      end

    end
  end
end
