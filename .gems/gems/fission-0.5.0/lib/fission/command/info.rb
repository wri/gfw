module Fission
  class Command
    class Info < Command

      def execute
        super
        incorrect_arguments unless @args.count == 1

        vm = VM.new @args.first

        output "name: #{vm.name}"

        guest_os_response = vm.guestos

        if guest_os_response.successful?
          os = guest_os_response.data.empty? ? 'unknown' : guest_os_response.data
          output "os: #{os}"
        else
          output_and_exit "There was an error getting the OS info.  The error was:\n#{guest_os_response.message}", guest_os_response.code
        end

        hardware_response = vm.hardware_info

        if hardware_response.successful?
          hardware_response.data.each_pair do |k, v|
            output "#{k}: #{v}"
          end
        else
          output_and_exit "There was an error getting the hardware info.  The error was:\n#{hardware_response.message}", hardware_response.code
        end

        network_response = vm.network_info

        if network_response.successful?
          network_response.data.each_pair do |int, data|
            data.each_pair do |k, v|
              output "#{int} #{k.gsub(/[-_]/, ' ')}: #{v}"
            end
            output ""
          end
        else
          output_and_exit "There was an error getting the network info.  The error was:\n#{network_response.message}", network_response.code
        end
      end

      def option_parser
        optparse = OptionParser.new do |opts|
          opts.banner = 'Usage: fission info TARGET_VM'
          opts.separator ''
          opts.separator 'Lists known information about TARGET_VM'
        end

        optparse
      end

      def summary
        'Show information for a VM'
      end

    end
  end
end
