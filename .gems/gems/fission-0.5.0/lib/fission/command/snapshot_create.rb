module Fission
  class Command
    class SnapshotCreate < Command

      def execute
        super
        incorrect_arguments unless @args.count == 2

        vm = VM.new @args[0]
        snap_name = @args[1]

        output "Creating snapshot"
        response = vm.create_snapshot snap_name

        if response.successful?
          output "Snapshot '#{snap_name}' created"
        else
          output_and_exit "There was an error creating the snapshot.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission snapshot create TARGET_VM SNAPSHOT_NAME"
          opts.separator ''
          opts.separator 'Creates a snapshot of TARGET_VM named SNAPSHOT_NAME'
        end

        optparse
      end

      def summary
        'Create a snapshot of a VM'
      end

    end
  end
end
