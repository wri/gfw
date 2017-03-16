module Fission
  class Command
    class SnapshotRevert < Command

      def execute
        super
        incorrect_arguments unless @args.count == 2

        vm = VM.new @args[0]
        snap_name = @args[1]

        output "Reverting to snapshot '#{snap_name}'"
        response = vm.revert_to_snapshot snap_name

        if response.successful?
          output "Reverted to snapshot '#{snap_name}'"
        else
          output_and_exit "There was an error reverting to the snapshot.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission snapshot revert TARGET_VM TARGET_SNAPSHOT"
          opts.separator ''
          opts.separator 'Reverts TARGET_VM to TARGET_SNAPSHOT'
        end

        optparse
      end

      def summary
        'Revert a VM to a snapshot'
      end

    end
  end
end
