module Fission
  class Command
    class SnapshotDelete < Command

      def execute
        super
        incorrect_arguments unless @args.count == 2

        vm = VM.new @args[0]
        snap_name = @args[1]

        output "Deleting snapshot"
        response = vm.delete_snapshot snap_name

        if response.successful?
          output "Snapshot '#{snap_name}' deleted"
        else
          output_and_exit "There was an error deleting the snapshot.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission snapshot delete TARGET_VM SNAPSHOT_NAME"
          opts.separator ''
          opts.separator 'Deletes the snapshot SNAPSHOT_NAME of TARGET_VM'
        end

        optparse
      end

      def summary
        'Delete a snapshot of a VM'
      end

    end
  end
end
