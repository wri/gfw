module Fission
  class Command
    class Delete < Command

      def initialize(args=[])
        super
        @options.force = false
      end

      def execute
        super
        incorrect_arguments if @args.count < 1

        vm = VM.new @args.first

        running_response = vm.running?

        if running_response.successful?
          if running_response.data
            output 'VM is currently running'
            if @options.force
              output 'Going to stop it'
              Command::Stop.new([vm.name]).execute
            else
              output_and_exit "Either stop/suspend the VM or use '--force' and try again.", 1
            end
          end
        else
          output_and_exit "There was an error determining if the VM is running.  The error was:\n#{running_response.message}", running_response.code
        end

        if Fusion.running?
          output 'It looks like the Fusion GUI is currently running'

          if @options.force
            output 'The Fusion metadata for the VM may not be removed completely'
          else
            output "Either exit the Fusion GUI or use '--force' and try again"
            output_and_exit "NOTE: Forcing a VM deletion with the Fusion GUI running may not clean up all of the VM metadata", 1
          end
        end

        delete_response = vm.delete

        if delete_response.successful?
          output ''
          output "Deletion complete!"
        else
          output_and_exit "There was an error deleting the VM.  The error was:\n#{delete_response.message}", delete_response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission delete TARGET_VM [OPTIONS]"
          opts.separator ''
          opts.separator 'Deletes TARGET_VM.'
          opts.separator ''
          opts.separator 'OPTIONS:'
          opts.on '--force', "Stop the VM if it's running and then delete it" do
            @options.force = true
          end
        end

        optparse
      end

      def summary
        'Delete a VM'
      end

    end
  end
end
