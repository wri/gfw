module Fission
  class Command
    class Stop < Command

      def execute
        super
        incorrect_arguments unless @args.count == 1

        vm = VM.new @args.first

        output "Stopping '#{vm.name}'"
        response = vm.stop

        if response.successful?
          output "VM '#{vm.name}' stopped"
        else
          output_and_exit "There was an error stopping the VM.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission stop TARGET_VM"
          opts.separator ''
          opts.separator 'Stop TARGET_VM.'
        end

        optparse
      end

      def summary
        'Stop a VM'
      end

    end
  end
end
