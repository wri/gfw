module Fission
  class UI

    # Internal: Returns the stdout value.
    attr_reader :stdout

    # Internal: Initialize a UI object.
    #
    # stdout - The object to use for stdout (default: $stdout).  This provides
    #          an easy way to capture/silence output if needed.
    #
    # Examples
    #
    #   Fission::UI.new
    #
    #   str_io = StringIO.new
    #   Fission::UI.new str_io
    def initialize(stdout=$stdout)
      @stdout = stdout
    end

    # Internal: Outputs the specified argument to the configured stdout object.
    # The 'puts' method will be called on the stdout object.
    #
    # s - The String to output.
    #
    # Examples
    #
    #   ui.output "foo bar\n"
    #
    # Returns nothing.
    def output(s)
      @stdout.puts s
    end

    # Internal: Outputs the specified arguments printf style.  The 'printf'
    # method will be called on the stdout object.  Currently, this assuems there
    # are two data items.
    #
    # string - The printf String.
    # key    - The String for the first data item.
    # value  - The String for the second data item.
    #
    # Examples
    #
    #   ui.output_printf "%s    %s\n", 'foo', bar
    #
    # Returns nothing.
    def output_printf(string, key, value)
      @stdout.send :printf, string, key, value
    end

    # Internal: Outputs the specified argument to the configured stdout object
    # and exits with the specified exit code.
    #
    # s         - The String to output.
    # exit_code - The Integer exit code.
    #
    # Examples
    #
    #   ui.output_and_exit 'something went wrong', 99
    #
    #   ui.output_and_exit 'all done', 0
    #
    # Returns nothing.
    def output_and_exit(s, exit_code)
      output s
      exit exit_code
    end
  end
end
