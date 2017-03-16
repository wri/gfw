require 'forwardable'
require 'fission/command_helpers'

module Fission
  class Command
    include Fission::CommandHelpers
    extend Forwardable

    def_delegators :@ui, :output, :output_and_exit, :output_printf

    # Internal: Returns the OpenStruct options of the command.
    attr_reader :options

    # Internal: Returns the Array arguments of the command.
    attr_reader :args

    # Internal: Initializes a new Command with some basic setup.  This is
    # intended to be used as a base class for other command classes to inherit
    # from.
    #
    # args - Array of arguments which will be assigned to the args instance
    #        variable.
    #
    # Examples
    #
    #   Fission::Command.new ['foo', 'bar']
    def initialize(args=[])
      ui
      @options = OpenStruct.new
      @args = args
    end

    # Internal: Primary method for performing an action within a command.
    #
    # Examples
    #
    #   command.execute
    #
    # Returns nothing
    def execute
      parse_arguments
    end

    # Internal: Helper method used to delegate UI related methods through.
    #
    # Examples
    #
    #   command.ui.output 'foo'
    #
    # Returns a UI instance.
    def ui
      @ui ||= UI.new
    end

    # Internal: Helper method to determine the command name of command class.
    # This should only be called against descendants of this class.
    #
    # #xamples:
    #   Fission::Command::SnapshotList.new.command_name
    #   # => 'snapshot list'
    #
    # Returns the command name as a String.
    def command_name(klass=self)
      klass.class.name.split('::')[2].
                       gsub(/([a-z\d])([A-Z])/,'\1_\2').
                       gsub('_', ' ').downcase
    end

    # Internal: Summmary of the command.  This is to be implemented by any
    # class which inherits from this class.
    #
    # Examples
    #   command.summary
    #   # => 'This command does x and y'
    #
    # Returns a String summary of the command.
    def summary
      raise NotImplementedError
    end

    # Internal: Helper method to return the help text of a command.  This is
    # intended to be used by a command class which inherits from this class.
    # This method will call the 'option_parser' method which must be defined in
    # any class which inherits from this class.
    #
    # Examples
    #
    #   Fission::Command::Suspend.help
    #
    # Returns a String of the output parser text.
    def self.help
      self.new.option_parser.to_s
    end

  end
end
