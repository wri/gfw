module Fission

  class VMConfiguration

    # Internal: Creates a new VMConfiguration object.  This accepts a VM object
    #
    # vm - An instance of VM
    #
    # Examples:
    #
    #   Fission::VMConfiguration.new @my_vm
    #
    # Returns a new VMConfiguration object
    def initialize(vm)
      @vm = vm
    end

    # Internal: Gathers the the configuration data for the VM.  This essentially
    # parses the key/value pairs from the configuration file (.vmx) into a Hash.
    #
    # Exaples:
    #
    #   @vm_config.config_data.data
    #   # => { 'memsize' => '384', 'ethernet0.present' => 'TRUE',... }
    #
    # Returns a Response object with the result.
    # If successful, the Response's data attribute will be a Hash.  All keys and
    # values are represented as a String (even when the value in the
    # configuration file is 'TRUE').  If a value is an empty string in the
    # configuration file, it will be represented in the Hash as an empty String.
    # If there is an error, an unsuccessful Response will be returned.
    def config_data
      return Response.new :code => 1, :message => 'VM does not exist' unless @vm.exists?

      conf_file_response = @vm.conf_file
      return conf_file_response unless conf_file_response.successful?

      @conf_file_location = conf_file_response.data

      Response.new :code => 0, :data => parse_vm_config_file
    end

    private
    # Internal: Parses the configuration file (i.e. '.vmx')
    #
    # Examples:
    #
    #   @vm_config.parse_vm_config_file
    #   # => { 'memsize' => '384', 'ethernet0.present' => 'TRUE',... }
    #
    # Returns a Hash.
    # All keys and values are represented as a String (even when the value in
    # the conf file is 'TRUE').  If a value is an empty string in the
    # configuration file, it will be represented in the Hash as an empty String.
    def parse_vm_config_file
      File.readlines(@conf_file_location).inject({}) do |result, line|
        data = parse_line_data(line)
        result[data[0]] = (data[1].nil? ? '' : data[1])
        result
      end
    end

    # Internal: Splits and formats a single line from a VM configuration file
    # into an Array.
    #
    # Examples:
    #
    #   @vm_config.parse_line_data('foo = "bar"')
    #
    # Returns an Array.  The first item will be the left side of the '=' and the
    # second item will be the right side.  This will also strip any whitespace
    # characters from the beginning or end of the provided line.
    def parse_line_data(line)
      line.strip.gsub('"', '').split ' = '
    end

  end

end
