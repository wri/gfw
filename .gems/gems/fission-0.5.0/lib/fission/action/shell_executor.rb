module Fission
  module Action

    class ShellExecutor

      # Internal: Create a new ShellExecutor object.
      #
      # cmd - Command to execute as a String
      #
      # Examples:
      #
      #   Fission::Action::ShellExecutor.new 'ls /var/log'
      #
      # Returns a new Fission::Action::ShellExecutor object.
      def initialize(cmd)
        @cmd = cmd
      end

      # Internal: Executes the command in the shell.  The command will be
      # executed using the ruby '`' method.
      #
      # Examples:
      #
      #   @executor.execute
      #
      # Returns a Hash with two keys.
      # The key 'output' will contain the output from the command.
      # The key 'process_status' will conatian a standard ruby Process::Status
      # object.
      def execute
        { 'output' => `#{@cmd}`, 'process_status' => $? }
      end

    end

  end
end
