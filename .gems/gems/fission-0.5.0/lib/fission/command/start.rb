module Fission
  class Command
    class Start < Command

      def initialize(args=[])
        super
        @options.headless = false
      end

      def execute
        super
        incorrect_arguments if @args.empty?

        vm = VM.new @args.first

        output "Starting '#{vm.name}'"
        start_args = {}

        start_args[:headless] = true if @options.headless

        response = vm.start start_args

        if response.successful?
          output "VM '#{vm.name}' started"
        else
          output_and_exit "There was a problem starting the VM.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission start TARGET_VM [OPTIONS]"
          opts.separator ''
          opts.separator 'Starts TARGET_VM.'
          opts.separator ''
          opts.separator 'OPTIONS:'
          opts.on '--headless', 'Start the VM in headless mode (i.e. no Fusion GUI console)' do
            @options.headless = true
          end
        end

        optparse
      end

      def summary
        'Start a VM'
      end

    end
  end
end
