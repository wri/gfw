module Fission
  module Action
    module VM

      class Suspender

        # Internal: Creates a new VMSuspender object.  This accepts a VM object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::VMSuspender.new @my_vm
        #
        # Returns a new VMSuspender object
        def initialize(vm)
          @vm = vm
        end

        # Public: Suspends a VM.  The VM must be running in order to suspend it.
        #
        # Examples
        #
        #   @suspender.suspend
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def suspend
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          running_response = @vm.running?
          return running_response unless running_response.successful?

          unless running_response.data
            return Response.new :code => 1, :message => 'VM is not running'
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          command = "#{vmrun_cmd} suspend "
          command << "'#{conf_file_response.data}' 2>&1"

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @suspender.vmrun_cmd
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
