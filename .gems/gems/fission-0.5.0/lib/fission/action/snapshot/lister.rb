module Fission
  module Action
    module Snapshot

      class Lister

        # Internal: Creates a new SnapshotLister object.  This accepts a VM
        # object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::SnapshotLister.new @my_vm
        #
        # Returns a new SnapshotLister object
        def initialize(vm)
          @vm = vm
        end

        # Internal: List the snapshots for a VM.
        #
        # Examples
        #
        #   @lister.snapshots.data
        #   # => ['snap 1', 'snap 2']
        #
        # Returns a Response with the result.
        # If successful, the Repsonse's data attribute will be an Array of the
        # snapshot names (String).
        # If there is an error, an unsuccessful Response will be returned.
        def snapshots
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          command = "#{vmrun_cmd} listSnapshots "
          command << "'#{conf_file_response.data}' 2>&1"

          command_exec = Fission::Action::ShellExecutor.new command
          result = command_exec.execute

          response = Response.new :code => result['process_status'].exitstatus

          if response.successful?
            response.data = parse_snapshot_names_from_output result['output']
          else
            response.message = result['output']
          end

          response
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @lister.vmrun_cmd
        #   # => "/foo/bar/vmrun -T fusion"
        #
        # Returns a String for the configured value of
        # Fission.config['vmrun_cmd'].
        def vmrun_cmd
          Fission.config['vmrun_cmd']
        end

        # Internal: Parses the output of the listSnapshot command.
        #
        # output - The output of the vmrun listSnapshot command.
        #
        # Examples:
        #   @lister.parse_snapshot_names_from_output cmd_output
        #   # => ['snap_1', 'snap_2']
        #
        # Returns an Array with the list of snapshot names.
        def parse_snapshot_names_from_output(cmd_output)
          header_text = 'Total snapshots:'
          snaps = cmd_output.split("\n").select { |s| !s.include? header_text }
          snaps.map { |s| s.strip }
        end

      end

    end
  end
end
