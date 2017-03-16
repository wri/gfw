module Fission
  module Action
    module VM

      class Starter

        # Internal: Creates a new VMStarter object.  This accepts a VM object.
        #
        # vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::VMStarter.new @my_vm
        #
        # Returns a new VMStarter object
        def initialize(vm)
          @vm = vm
        end

        # Public: Starts a VM.  The VM must not be running in order to start it.
        #
        # options - Hash of options:
        #           :headless - Boolean which specifies to start the VM without
        #                       a GUI console.  The Fusion GUI must not be
        #                       running in order to start the VM headless.
        #                       (default: false)
        #
        # Examples
        #
        #   @vm_starter.start
        #
        #   @vm_starter.start :headless => true
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def start(options={})
          unless @vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          running_response = @vm.running?
          return running_response unless running_response.successful?

          if running_response.data
            return Response.new :code => 1, :message => 'VM is already running'
          end

          conf_file_response = @vm.conf_file
          return conf_file_response unless conf_file_response.successful?

          unless options[:headless].blank?
            if Fusion.running?
              message = 'It looks like the Fusion GUI is currently running.  '
              message << 'A VM cannot be started in headless mode when the Fusion GUI is running.  '
              message << 'Exit the Fusion GUI and try again.'
              return Response.new :code => 1, :message => message
            end
          end

          command = "#{vmrun_cmd} start "
          command << "'#{conf_file_response.data}' "

          command << (options[:headless].blank? ? 'gui ' : 'nogui ')
          command << '2>&1'

          command_exec = Fission::Action::ShellExecutor.new command
          Response.from_shell_executor command_exec.execute
        end

        private
        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @vm_starter.vmrun_cmd
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
