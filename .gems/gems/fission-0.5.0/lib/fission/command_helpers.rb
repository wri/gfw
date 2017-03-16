module Fission
  module CommandHelpers

    # Internal: Outputs the help text for a command and exits.
    #
    # Examples
    #
    #   incorrect_arguments
    #
    # Returns nothing.
    # This will call the help class method for the help text.  This will exit
    # with the exit code 1.
    def incorrect_arguments
      output "#{self.class.help}\n"
      output_and_exit "Incorrect arguments for #{command_name} command", 1
    end

    # Internal: Parses the command line arguments.
    #
    # Examples:
    #
    #   parse_arguments
    #
    # Returns nothing.
    # If there is an invalid argument, an error will be output and this will
    # exit with exit code 1.
    def parse_arguments
      option_parser.parse! @args
    rescue OptionParser::InvalidOption => e
      output e
      output_and_exit "\n#{self.class.help}", 1
    end

  end
end
