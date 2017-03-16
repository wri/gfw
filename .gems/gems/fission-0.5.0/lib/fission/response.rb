module Fission
  class Response

    # Public: Gets/Sets the code (Integer).
    attr_accessor :code

    # Public: Gets/Sets the message (String).
    attr_accessor :message

    # Public: Gets/Sets the data (can be any of type as needed).
    attr_accessor :data

    # Public: Initialize a Response object.
    #
    # args - Hash of arguments:
    #       :code    - Integer which denotes the code of the Response.  This is
    #                  similar in concept to command line exit codes.  The
    #                  convention is that 0 denotes success and any other value
    #                  is unsuccessful (default: 1).
    #       :message - String which denotes the message of the Response.  The
    #                  convention is that this should only be used when the
    #                  Response is unsuccessful (default: '').
    #       :data    - Any valid ruby object.  This is used to convey any
    #                  data that needs to be used by a caller.  The convention
    #                  is that this should only be used when the Response is
    #                  successful (default nil).
    #
    # Examples
    #
    #   Response.new :code => 0, :data => [1, 2, 3, 4]
    #
    #   Response.new :code => 0, :data => true
    #
    #   Response.new :code => 5, :message => 'Something went wrong'
    #
    # Returns a new Response instance.
    def initialize(args={})
      @code = args.fetch :code, 1
      @message = args.fetch :message, ''
      @data = args.fetch :data, nil
    end

    # Public: Helper method to determine if a response is successful or not.
    #
    # Examples
    #
    #   response.successful?
    #   # => true
    #
    #   response.successful?
    #   # => false
    #
    # Returns a Boolean.
    # Returns true if the code is 0.
    # Returns false if the code is any other value.
    def successful?
      @code == 0
    end

    # Internal: Helper method to create a new Response object when using
    # executing a command through Fission::Action::ShellExecutor.
    #
    # shell_execute_result - This should be the result of running 'execute' on
    #                        a ShellExecutor object.
    #
    # Examples:
    #
    #   Response.from_shell_executor shell_execute_result
    #
    # Returns a Response.
    # The code attribute of the Response will be set to the exit_status
    # attribute of the provided process_status data. The message attribute of
    # the Response will be set to the output of the provided data if, and only
    # if, the Response is unsuccessful.
    def self.from_shell_executor(shell_execute_result)
      response = new :code => shell_execute_result['process_status'].exitstatus
      unless response.successful?
        response.message = shell_execute_result['output']
      end
      response
    end

  end
end
