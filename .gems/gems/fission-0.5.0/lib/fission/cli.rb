module Fission
  class CLI

    # Internal: Creates a new Fission::CLI object.  This automatically parses
    # the arguments in ARGV.  This will also automatically display the usage
    # and exit if applicable.
    #
    # Examples
    #
    #   Fission::CLI.new
    #
    # Returns a Fission::CLI object.
    def initialize(args=ARGV, parser=CommandLineParser)
      @args = args ||= ARGV

      @parser = parser.new @args

      parse_arguments
    end

    # Internal: Execute the determined command.
    #
    # Examples:
    #
    #   Fission::CLI.new(ARGV).execute
    #
    # Returns nothing.
    def execute
      @cmd.execute
    end

    private
    # Internal: Parses the arguments using the parser.
    #
    # Examples:
    #
    #   @cli.parse_arguments
    #
    # Returns nothing.
    def parse_arguments
      @parser.parse
      @cmd = @parser.command
    end

  end
end
