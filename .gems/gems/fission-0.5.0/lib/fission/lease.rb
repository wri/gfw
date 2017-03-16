module Fission
  class Lease

    # Public: Get/set the IP address for the lease.
    attr_accessor :ip_address

    # Public: Get/set the MAC address for the lease.
    attr_accessor :mac_address

    # Public: Get/set the start DateTime for the lease.
    attr_accessor :start

    # Public: Get/set the end DateTime for the lease.
    attr_accessor :end

    # Public: Initialize a Lease object.
    #
    # args - Hash of arguments:
    #        :ip_address  - String which denotes the IP address of the lease.
    #        :mac_address - String which denotes the MAC address of the lease.
    #        :start       - DateTime which denotes the start of the lease.
    #        :end         - DateTime which denotes the end of the lease.
    #
    # Examples
    #
    # Returns a new Lease instance.
    def initialize(args={})
      @ip_address = args[:ip_address]
      @mac_address = args[:mac_address]
      @start = args[:start]
      @end = args[:end]
    end

    # Public: Determine if the lease has expired or not.
    #
    # Examples:
    #
    #   @lease.expired?
    #   # => true
    #
    # Returns a Boolean.  The Boolean is determined by comparing the end
    # attribute to the current date/time.
    def expired?
      @end < DateTime.now
    end

    # Public: Provides all of the known leases.
    #
    # Examples:
    #
    #   Fission::Lease.all
    #   # => [#<Fission::Lease:0x000001008b6d88...>,
    #         #<Fission::Lease:0x000001008522c0...>]
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be an Array of Lease
    # objects.  If no leases are found, then the Response's data attribute will
    # be an empty Array.
    # If there is an error, an unsuccessful Response will be returned.
    def self.all
      response = Response.new

      if File.file? Fission.config['lease_file']
        content = File.read Fission.config['lease_file']

        response.data = content.split('}').collect do |entry|
          parse entry
        end

        content = nil

        response.code = 0
      else
        response.code = 1
        response.message = "Unable to find the lease file '#{Fission.config['lease_file']}'"
      end

      response
    end

    # Public: Get lease information for a specific MAC address.
    #
    # mac_address - MAC address (String) to search for.
    #
    # Examples
    #
    #   Fission::Lease.find_by_mac '00:11:AA:bb:cc:22'
    #   # => #<Fission::Lease:0x000001008522c0...>
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Lease object if the
    # MAC address was found.  The Response's data attribute will be nil if the
    # MAC address was not found.
    # If there is an error, an unsuccessful Response will be returned.
    def self.find_by_mac_address(mac_address)
      all_response = all

      if all_response.successful?
        response = Response.new :code => 0
        leases = all_response.data.find_all { |l| l.mac_address == mac_address }
        response.data = leases.sort_by { |l| l.end }.last
      else
        response = all_response
      end

      response
    end

    private
    # Internal: Parses information out of a DHCP lease entry.
    #
    # entry - String of lease entry text.
    #
    # Examples
    #
    #   Lease.parse my_lease_entry
    #   # => #<Fission::Lease:0x000001008522c0...>
    #
    #
    # Returns a Lease object which is populated with the attribute that were
    # found.
    def self.parse(lease_entry)
      lease = Lease.new

      lease_entry.gsub! ';', ''

      lease_entry.split("\n").each do |line|
        next if line =~ /^#/

        line.strip!

        case line.strip
        when /^lease/
          lease.ip_address = line.split(' ')[1]
        when /^starts/
          lease.start = DateTime.parse(line.split(' ')[2..3].join(' '))
        when /^end/
          lease.end = DateTime.parse(line.split(' ')[2..3].join(' '))
        when /^hardware/
          lease.mac_address = line.split(' ')[2]
        end
      end

      lease

    end

  end
end
