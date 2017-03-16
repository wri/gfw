module Fission
  class Command
    class SnapshotList < Command

      def execute
        super
        incorrect_arguments unless @args.count == 1

        vm = VM.new @args.first

        response = vm.snapshots

        if response.successful?
          snaps = response.data

          if snaps.any?
            output snaps.join("\n")
          else
            output "No snapshots found for VM '#{vm.name}'"
          end
        else
          output_and_exit "There was an error listing the snapshots.  The error was:\n#{response.message}", response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = "Usage: fission snapshot list TARGET_VM"
          opts.separator ''
          opts.separator 'Lists all of the snapshots for TARGET_VM'
        end

        optparse
      end

      def summary
        'List the snapshots of a VM'
      end

    end
  end
end
