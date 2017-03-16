module Fission
  module Action
    module VM

      class Stopper

        # Internal: Creates a new VMStopper object.  This accepts a VM object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::VMStopper.new @my_vm
        #
        # Returns a new VMStopper object
        def initialize(vm)
          @vm = vm
        end

        # Public: Stops a VM.  The VM must be running in order to stop it.
        #
        # options - Hash of options:
        #           :hard - Boolean which specifies to power off the VM (instead
        #                   of attempting to initiate a graceful shutdown). This
        #                   is the equivalent of passing 'hard' to the vmrun
        #                   stop command.
        #                   (default: false)
        #
        # Examples
        #
        #   @stopper.stop
        #
        #   @stopper.stop :hard => true
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def stop(options={})
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

          command = "#{vmrun_cmd} stop "
          command << "'#{conf_file_response.data}' "
          command << 'hard ' unless options[:hard].blank?
          command << '2>&1'

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @vm_stopper.vmrun_cmd
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
