module Fission
  class Command
    class Suspend < Command

      def initialize(args=[])
        super
        @options.all = false
      end

      def execute
        super
        incorrect_arguments if @args.count != 1 && !@options.all

        vms_to_suspend.each do |vm|
          output "Suspending '#{vm.name}'"
          response = vm.suspend

          if response.successful?
            output "VM '#{vm.name}' suspended"
          else
            output_and_exit "There was an error suspending the VM.  The error was:\n#{response.message}", response.code
          end
        end
      end

      def vms_to_suspend
        if @options.all
          response = VM.all_running

          if response.successful?
            vms = response.data
          else
            output_and_exit "There was an error getting the list of running VMs.  The error was:\n#{response.message}", response.code
          end
        else
          vms = [ VM.new(@args.first) ]
        end

        vms
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission suspend [TARGET_VM | --all]"
          opts.separator ''
          opts.separator 'Suspend TARGET_VM or all VMs.'
          opts.separator ''
          opts.separator 'OPTIONS:'
          opts.on '--all', 'Suspend all running VMs' do
            @options.all = true
          end
        end

        optparse
      end

      def summary
        'Suspend a VM'
      end

    end
  end
end
