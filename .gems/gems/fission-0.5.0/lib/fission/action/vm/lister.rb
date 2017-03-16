module Fission
  module Action
    module VM

      class Lister

        # Public: Provides all of the VMs which are located in the VM directory.
        #
        # Examples
        #
        #   Fission::VM.all.data
        #   # => [<Fission::VM:0x007fd6fa24c5d8 @name="foo">,
        #         <Fission::VM:0x007fd6fa23c5e8 @name="bar">]
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be an Array of VM
        # objects.  If no VMs are found, the Response's data attribute will be an
        # empty Array.
        # If there is an error, an unsuccessful Response will be returned.
        def all
          vm_dirs = Dir[File.join Fission.config['vm_dir'], '*.vmwarevm'].select do |d|
            File.directory? d
          end

          response = Response.new :code => 0
          response.data = vm_dirs.collect do |dir|
            Fission::VM.new(File.basename dir, '.vmwarevm')
          end

          response
        end

        # Public: Provides all of the VMs which are currently running.
        #
        # Examples
        #
        #   Fission::VM.all_running.data
        #   # => [<Fission::VM:0x007fd6fa24c5d8 @name="foo">,
        #         <Fission::VM:0x007fd6fa23c5e8 @name="bar">]
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be an Array of VM
        # objects which are running.  If no VMs are running, the Response's data
        # attribute will be an empty Array.
        # If there is an error, an unsuccessful Response will be returned.
        def all_running
          command = "#{Fission.config['vmrun_cmd']} list"
          command_executor = Fission::Action::ShellExecutor.new command
          result = command_executor.execute

          response = Response.new :code => result['process_status'].exitstatus

          if response.successful?
            response.data = get_vm_objects_from_list_output result['output']
          else
            response.message = result['output']
          end

          response
        end

        # Public: Provides a list of all of the VMs and their associated status
        #
        # Examples
        #
        #   Fission::VM.all_with_status.data
        #   # => { 'vm1' => 'running', 'vm2' => 'suspended', 'vm3' => 'not running'}
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be a Hash of with the VM
        # names as keys and their status as the values.
        # If there is an error, an unsuccessful Repsonse will be returned.
        def all_with_status
          all_response = all
          return all_response unless all_response.successful?

          all_vms = all_response.data

          running_response = all_running
          return running_response unless running_response.successful?

          response = Response.new :code => 0

          @all_running_vm_names = running_response.data.collect { |v| v.name }

          response.data = all_vms.inject({}) do |result, vm|
            result[vm.name] = determine_status vm
            result
          end

          response
        end

        private
        # Internal: Helper to determines the status of a VM.
        #
        # vm - The VM object.
        #
        # Examples:
        #
        #   @lister.determine_status my_vm
        #   # => 'suspended'
        #
        # Returns a String of the status.
        def determine_status(vm)
          return 'running' if @all_running_vm_names.include? vm.name
          return 'suspended' if vm.suspend_file_exists?
          return 'not running'
        end

        # Internal: Helper to get VM objects from the output of running VMs.
        #
        # output - output from the list command.
        #
        # Examples:
        #
        #   @lister.get_vm_objects_from_list_output my_output
        #   # => [<Fission::VM:0x007fd6fa24c5d8 @name="foo">,
        #         <Fission::VM:0x007fd6fa23c5e8 @name="bar">]
        #
        # Returns an Array of VM objects.
        def get_vm_objects_from_list_output(output)
          vms = output.split("\n").select do |vm|
            vm.include?('.vmx') &&
            File.exists?(vm) &&
            File.extname(vm) == '.vmx'
          end

          vms.collect do |vm|
            Fission::VM.new File.basename(File.dirname(vm), '.vmwarevm')
          end
        end

      end

    end
  end
end
