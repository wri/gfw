module Fission

  class CommandLineParser

    # Internal: Creates a new Fission::CommandLineParser object.
    #
    # args - The command line arguments to parse.  This is expected to be in the
    # same format of ARGV (Array) (default: ARGV).
    #
    # Examples:
    #
    #   CommandLineParser.new ['foo', 'bar']
    #
    #   CommandLineParser.new
    #
    # Returns a Fission::CommandLineParser object.
    def initialize(args=ARGV)
      @args = args

      gather_commands_and_summaries

      setup_options_parser
    end

    # Internal: Parses the command line arguments.  If the arguments are
    # invalid, the appropriate help will be output and then will exit.  If the
    # arguments are valid, then the @command variable will be set to a new
    # instance of the determined command class.
    #
    # Examples:
    #
    #   @command_line_parser.parse
    #
    # Returns nothing.
    def parse
      @options_parser.order! @args

      determine_command_provided
      self
    rescue OptionParser::InvalidOption => e
      ui.output e
      show_all_help
      exit 1
    end

    # Internal: Accessor for an instance of the determined command. This is set
    # by running the parse method.
    #
    # Examples:
    #
    #   @command_line_parser.command
    #
    # Returns an instance of the determined command if the arguments are valid.
    # Returns nil if the parse command has not yet been run.
    def command
      @command
    end

    private
    # Internal: Sets up the base option parser.
    #
    # Examples:
    #
    #   @cli.setup_option_parser
    #
    # Returns nothing.  This will set the @option_parser instance variable.
    def setup_options_parser
      @options_parser = OptionParser.new do |opts|
        opts.banner = "\nUsage: fission [options] COMMAND [arguments]"

        opts.on_head('-v', '--version', 'Output the version of fission') do
          ui.output VERSION
          exit 0
        end

        opts.on_head('-h', '--help', 'Displays this message') do
          show_all_help
          exit 0
        end
      end
    end

    # Internal: Provides the help of all of the known commands.
    #
    # Examples
    #
    #   @cli.commands_help
    #
    # Outputs the summary text for all known commands.
    def commands_help
      longest_cmd = @commands.inject do |longest, cmd_name|
        longest.length > cmd_name.length ? longest : cmd_name
      end

      ui.output "\nCommands:"

      Hash[@command_names_and_summaries.sort].each_pair do |name, summary|
        ui.output_printf "%-#{longest_cmd.length}s      %s\n", name, summary
      end
    end

    # Internal: Determines all of the available commands and their summaries.
    #
    # Examples
    #
    #   @cli.command_names_and_summaries
    #   # => { 'clone' => 'Clones a VM', 'stop' => 'Stops a VM' }
    #
    # Returns nothing.  This will set the @command_names_and_summaries instance
    # variable with the result.
    def gather_commands_and_summaries
      @command_names_and_summaries = Command.descendants.inject({}) do |result, klass|
        cmd = klass.new
        result[cmd.command_name] = cmd.summary
        result
      end

      @commands = @command_names_and_summaries.keys.sort
    end

    # Internal: Determines the command that has been provided.  If it is
    # determined that an invalid command is provided, then the help/usage will
    # be displayed and it will exit.
    #
    # Examples:
    #
    #   @cli.determine_command_to_execute
    #
    # Returns nothing.  This will set the @command instance variable to an instance
    # of the appropriate command class (assuming it is valid).
    def determine_command_provided
      if @commands.include? @args.first
        @command = Command.const_get(@args.first.capitalize).new @args.drop 1
      elsif is_snapshot_command?
        klass = @args.take(2).map {|c| c.capitalize}.join('')
        @command = Command.const_get(klass).new @args.drop 2
      else
        show_all_help
        exit 1
      end
    end

    # Internal: Determines if the provided command is a snapshot related
    # command.  This will use the @args instance variable to make the
    # determination.
    #
    # Examples
    #
    #   @cli.is_snapshot_command? ['foo', 'bar']
    #   # => false
    #
    #   @cli.is_snapshot_command? ['snapshot', 'list']
    #   # => true
    #
    # Returns a Boolean of whether a snapshot command was given or not.
    def is_snapshot_command?
      @args.first == 'snapshot' &&
      @args.count > 1 &&
      @commands.include?(@args.take(2).join(' '))
    end

    # Internal: Outputs the usage as well as the known commands and their
    # summaries.
    #
    # Examples
    #
    #   @cli.show_all_help
    #   # => 'fission options command arguments ....'
    #
    # Returns nothing.
    def show_all_help
      ui.output @options_parser
      commands_help
    end

    # Internal: Helper method for outputting text to the ui
    #
    # Examples
    #
    #   @cli.ui.output 'foo'
    #
    # Returns a UI instance.
    def ui
      @ui ||= UI.new
    end

  end

end
