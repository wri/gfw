module Fission
  class VM

    # Public: Gets the name of the VM as a String.
    attr_reader :name

    def initialize(name)
      @name = name
    end

    # Public: Creates a snapshot for a VM.  The VM must be running in order
    # to create a snapshot.  Snapshot names must be unique.
    #
    # name - The desired name of the snapshot.  The name must be unique.
    #
    # Examples
    #
    #   @vm.create_snapshot('foo_snap_1')
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def create_snapshot(name)
      Fission::Action::Snapshot::Creator.new(self).create_snapshot(name)
    end

    # Public: Deletes a snapshot for a VM.  The snapshot to delete must exist.
    # If the Fusion GUI is running, then the VM must also be running.
    #
    # name - The name of the snapshot to delete.
    #
    # Examples
    #
    #   @vm.delete_snapshot('foo_snap_1')
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def delete_snapshot(name)
      Fission::Action::Snapshot::Deleter.new(self).delete_snapshot(name)
    end

    # Public: Reverts the VM to the specified snapshot.  The snapshot to revert
    # to must exist and the Fusion GUI must not be running.
    #
    # name - The snapshot name to revert to.
    #
    # Examples
    #
    #   @vm.revert_to_snapshot('foo_snap_1')
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def revert_to_snapshot(name)
      Fission::Action::Snapshot::Reverter.new(self).revert_to_snapshot(name)
    end

    # Public: List the snapshots for a VM.
    #
    # Examples
    #
    #   @vm.snapshots.data
    #   # => ['snap 1', 'snap 2']
    #
    # Returns a Response with the result.
    # If successful, the Repsonse's data attribute will be an Array of the
    # snapshot names (String).
    # If there is an error, an unsuccessful Response will be returned.
    def snapshots
      Fission::Action::Snapshot::Lister.new(self).snapshots
    end

    # Public: Deletes a VM.  The VM must not be running in order to delete it.
    # As there are a number issues with the Fusion command line tool for
    # deleting VMs, this is a best effort.  The VM must not be running when this
    # method is called.  This essentially deletes the VM directory and attempts
    # to remove the relevant entries from the Fusion plist file.  It's highly
    # recommended to delete VMs without the Fusion GUI running.  If the Fusion
    # GUI is running this method should succeed, but it's been observed that
    # Fusion will recreate the plist data which is deleted.  This leads to
    # 'missing' VMs in the Fusion GUI.
    #
    # Examples
    #
    #   @vm.delete
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def delete
      Fission::Action::VM::Deleter.new(self).delete
    end

    # Public: Starts a VM.  The VM must not be running in order to start it.
    #
    # options - Hash of options:
    #           :headless - Boolean which specifies to start the VM without a
    #                       GUI console.  The Fusion GUI must not be running in
    #                       order to start the VM headless.
    #                       (default: false)
    #
    # Examples
    #
    #   @vm.start
    #
    #   @vm.start :headless => true
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def start(options={})
      Fission::Action::VM::Starter.new(self).start(options)
    end

    # Public: Stops a VM.  The VM must be running in order to stop it.
    #
    # options - Hash of options:
    #           :hard - Boolean which specifies to power off the VM (instead of
    #                   attempting to initiate a graceful shutdown).  This is
    #                   the equivalent of passing 'hard' to the vmrun stop
    #                   command.
    #                   (default: false)
    #
    # Examples
    #
    #   @vm.stop
    #
    #   @vm.stop :hard => true
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def stop(options={})
      Fission::Action::VM::Stopper.new(self).stop(options)
    end

    # Public: Suspends a VM.  The VM must be running in order to suspend it.
    #
    # Examples
    #
    #   @vm.suspend
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def suspend
      Fission::Action::VM::Suspender.new(self).suspend
    end

    # Public: Provides virtual hardware info the VM
    #
    # Examples:
    #
    #   @vm.hardware_info.data
    #   # => {'cpus' => 2, 'memory' => 1024}
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Hash with the
    # info found.
    # If there is an error, an unsuccessful Response will be returned.
    def hardware_info
      config_response = conf_file_data
      return config_response unless config_response.successful?

      response = Response.new :code => 0, :data => {}

      response.data['cpus'] = 1

      { 'cpus' => 'numvcpus', 'memory' => 'memsize' }.each_pair do |k,v|
        unless config_response.data[v].blank?
          response.data[k] = config_response.data[v].to_i
        end
      end

      response
    end

    # Public: Provides the MAC addresses for a VM.
    #
    # Examples:
    #
    #   @vm.mac_addresses.data
    #   # => ['00:0c:29:1d:6a:64', '00:0c:29:1d:6a:75']
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be an Array of the MAC
    # addresses found.  If no MAC addresses are found, the Response's data
    # attribute will be an empty Array.
    # If there is an error, an unsuccessful Response will be returned.
    def mac_addresses
      network_response = network_info
      return network_response unless network_response.successful?

      response = Response.new :code => 0
      response.data = network_response.data.values.collect { |n| n['mac_address'] }

      response
    end

    # Public: Network information for a VM.  Includes interface name, associated
    # MAC address, and IP address (if applicable).
    #
    # Examples:
    #
    #   # if IP addresses are found in the Fusion DHCP lease file
    #   response = @vm.network_info.data
    #   # => { 'ethernet0' => { 'mac_address' => '00:0c:29:1d:6a:64',
    #                           'ip_address'  => '127.0.0.1' },
    #          'ethernet1' => { 'mac_address' => '00:0c:29:1d:6a:75',
    #                           'ip_address'  => '127.0.0.2' } }
    #
    #   # if IP addresses are not found in the Fusion DHCP lease file
    #   response = @vm.network_info.data
    #   # => { 'ethernet0' => { 'mac_address' => '00:0c:29:1d:6a:64',
    #                           'ip_address'  => nil },
    #          'ethernet1' => { 'mac_address' => '00:0c:29:1d:6a:75',
    #                           'ip_address'  => nil } }
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Hash with the
    # interface identifiers as the keys and the associated MAC address.  If an
    # IP address was found in the Fusion DHCP lease file, then it will
    # be included.  If an IP address was not found, then the IP address value
    # will be nil.  If there are no network interfaces, the Response's data
    # attribute will be an empty Hash.
    # If there is an error, an unsuccessful Response will be returned.
    def network_info
      config_response = conf_file_data
      return config_response unless config_response.successful?

      response = Response.new :code => 0, :data => {}

      interface_pattern = /^ethernet\d+/
      mac_pattern = /(\w\w[:-]\w\w[:-]\w\w[:-]\w\w[:-]\w\w[:-]\w\w)/

      config_response.data.each_pair do |k,v|
        if v =~ mac_pattern
          mac = v
          int = k.scan(interface_pattern).first
          response.data[int] = { 'mac_address' => mac }
          lease_response = Fission::Lease.find_by_mac_address mac
          return lease_response unless lease_response.successful?

          response.data[int]['ip_address'] = nil
          if lease_response.data
            response.data[int]['ip_address'] = lease_response.data.ip_address
          end
        end
      end

      response
    end

    # Public: Provides the Fussion GuestOS profile.
    #
    # Examples
    #
    #   @vm.guestos.data
    #   # => 'debian5'
    #
    # Returns a Response with the result.
    # If the Response is successful, the Response's data attribute will
    # be populated with a string that is the guest operatingsystem used for the
    # virtual machine.
    # If there is an error, an unsuccessful Response will be returned.
    def guestos
      config_response = conf_file_data
      return config_response unless config_response.successful?

      response = Response.new :code => 0, :data => {}
      response.data = config_response.data.fetch 'guestOS', ''
      response
    end

    # Public: Provides various uuids associated with a VM.
    #
    # Examples
    #
    #   @vm.uuids.data
    #   # => {"bios"=>"56 4d ee 72 3b 7e 47 67-69 aa 65 cb 5e 40 3f 21",
    #         "location"=>"56 4d 2e 15 f4 ed 00 a7-c5 99 43 32 b8 76 ef d5"}
    #
    # Returns a Response with the result.
    # If the Response is successful, the Response's data attribute will
    # be populated with a hash that is comprised of the various uuids that are
    # associated with each VM.  If the VM is newly created they will be the same
    # but if you selected 'I Moved It' from the Fusion GUI they will differ.
    # If there is an error, an unsuccessful Response will be returned.
    def uuids
      config_response = conf_file_data
      return config_response unless config_response.successful?

      response = Response.new :code => 0, :data => {}

      { 'bios' => 'uuid.bios', 'location' => 'uuid.location' }.each_pair do |k,v|
        unless config_response.data[v].blank?
          response.data[k] = config_response.data[v]
        end
      end

      response
    end

    # Public: Provides the state of the VM.
    #
    # Examples
    #
    #   @vm.state.data
    #   # => 'running'
    #
    #   @vm.state.data
    #   # => 'not running'
    #
    #   @vm.state.data
    #   # => 'suspended'
    #
    # Returns a Response with the result.
    # If the Response is successful, the Response's data attribute will
    # be a String of the state.  If the VM is currently powered on, the state
    # will be 'running'.  If the VM is deemed to be suspended, the state will be
    # 'suspended'.  If the VM is not running and not deemed to be suspended, the
    # state will be 'not running'.
    # If there is an error, an unsuccessful Response will be returned.
    def state
      running_response = running?
      return running_response unless running_response.successful?

      response = Response.new :code => 0, :data => 'not running'

      if running_response.data
        response.data = 'running'
      else
        suspended_response = suspended?
        return suspended_response unless suspended_response.successful?

        response.data = 'suspended' if suspended_response.data
      end

      response
    end

    # Public: Determines if the VM exists or not.  This method looks for the
    # VM's conf file ('.vmx') to determine if the VM exists or not.
    #
    # Examples
    #
    #   @vm.exists?
    #   # => true
    #
    # Returns a Boolean.
    def exists?
      conf_file.successful?
    end

    # Public: Determines if a VM is suspended.
    #
    # Examples
    #
    #   @vm.suspended?.data
    #   # => true
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Boolean.  If the VM
    # is not running, then this method will look for a '.vmem' file in the VM's
    # directory.  If a '.vmem' file exists and it matches the name of the VM,
    # then the VM is considered to be suspended.  If the VM is running or if a
    # matching '.vmem' file is not found, then the VM is not considered to be
    # suspended.
    # If there is an error, an unsuccessful Response will be returned.
    def suspended?
      running_response = running?
      return running_response unless running_response.successful?

      response = Response.new :code => 0, :data => false
      response.data = suspend_file_exists? unless running_response.data

      response
    end

    # Public: Determines if a VM has a suspend file ('.vmem') in it's directory.
    # This only looks for a suspend file which matches the name of the VM.
    #
    # Examples
    #
    #   @vm.suspend_file_exists?
    #   # => true
    #
    # Returns a Boolean.
    def suspend_file_exists?
      File.file? File.join(path, "#{@name}.vmem")
    end

    # Public: Determines if a VM is running.
    #
    # Examples
    #
    #   @vm.running?.data
    #   # => true
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Boolean.
    # If there is an error, an unsuccessful Response will be returned.
    def running?
      all_running_response = self.class.all_running
      return all_running_response unless all_running_response.successful?

      response = Response.new :code => 0, :data => false

      if all_running_response.data.collect { |v| v.name }.include? @name
        response.data = true
      end

      response
    end

    # Public: Provides the configuration data stored in the VM's configuration
    # file ('.vmx').
    #
    # Examples
    #
    #   @vm.conf_file_data
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute with be a Hash of the
    # configuration data.  All of the keys/values in the configuration data will
    # be a String.
    # If there is an error, an unsuccessful Response will be returned.
    def conf_file_data
      VMConfiguration.new(self).config_data
    end

    # Public: Determines the path to the VM's config file ('.vmx').
    #
    # Examples
    #
    #   @vm.conf_file.data
    #   # => '/my_vms/foo/foo.vmx'
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a String which will
    # be escaped for spaces (' ').
    # If there is a single '.vmx' file in the VM's directory, regardless if
    # the name of '.vmx' file matches the VM name, the Response's data
    # attribute will the be the path to the '.vmx' file.
    # If there are multiple '.vmx' files found in the VM's directory, there are
    # a couple of different possible outcomes.
    # If one of the file names matches the VM directory name, then the
    # Response's data attribute will be the path to the matching '.vmx' file.
    # If none of the file names match the VM directory name, then this is deemed
    # an error condition and an unsuccessful Response will be returned.
    # If there is an error, an unsuccessful Response will be returned.
    def conf_file
      vmx_path = File.join path, "*.vmx"
      conf_files = Dir.glob vmx_path

      response = Response.new

      case conf_files.count
      when 0
        response.code = 1
        response.message = "Unable to find a config file for VM '#{@name}' (in '#{vmx_path}')"
      when 1
        response.code = 0
        response.data = conf_files.first
      else
        if conf_files.include?(File.join(File.dirname(vmx_path), "#{@name}.vmx"))
          response.code = 0
          response.data = File.join(File.dirname(vmx_path), "#{@name}.vmx")
        else
          response.code = 1
          output = "Multiple config files found for VM '#{@name}' ("
          output << conf_files.sort.map { |f| "'#{File.basename(f)}'" }.join(', ')
          output << " in '#{File.dirname(vmx_path)}')"
          response.message = output
        end
      end

      response
    end

    # Public: Provides the expected path to a VM's directory.  This does not
    # imply that the VM or path exists.
    #
    # name - The name of the VM to provide the path for.
    #
    # Examples
    #
    #   @vm.path
    #   # => '/vm/foo.vmwarevm'
    #
    # Returns the path (String) to the VM's directory.
    def path
      File.join Fission.config['vm_dir'], "#{@name}.vmwarevm"
    end

    # Public: Provides all of the VMs which are located in the VM directory.
    #
    # Examples
    #
    #   Fission::VM.all.data
    #   # => [<Fission::VM:0x007fd6fa24c5d8 @name="foo">,
    #         <Fission::VM:0x007fd6fa23c5e8 @name="bar">]
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be an Array of VM
    # objects.  If no VMs are found, the Response's data attribute will be an
    # empty Array.
    # If there is an error, an unsuccessful Response will be returned.
    def self.all
      Fission::Action::VM::Lister.new.all
    end

    # Public: Provides all of the VMs which are currently running.
    #
    # Examples
    #
    #   Fission::VM.all_running.data
    #   # => [<Fission::VM:0x007fd6fa24c5d8 @name="foo">,
    #         <Fission::VM:0x007fd6fa23c5e8 @name="bar">]
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be an Array of VM
    # objects which are running.  If no VMs are running, the Response's data
    # attribute will be an empty Array.
    # If there is an error, an unsuccessful Response will be returned.
    def self.all_running
      Fission::Action::VM::Lister.new.all_running
    end

    # Public: Provides a list of all of the VMs and their associated status
    #
    # Examples
    #
    #   Fission::VM.all_with_status.data
    #   # => { 'vm1' => 'running', 'vm2' => 'suspended', 'vm3' => 'not running'}
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be a Hash of with the VM
    # names as keys and their status as the values.
    # If there is an error, an unsuccessful Repsonse will be returned.
    def self.all_with_status
      Fission::Action::VM::Lister.new.all_with_status
    end

    # Public: Creates a new VM which is a clone of an existing VM.  As Fusion
    # doesn't provide a native cloning mechanism, this is a best effort.  This
    # essentially is a directory copy with updates to relevant files.  It's
    # recommended to clone VMs which are not running.
    #
    # source_vm_name - The name of the VM to clone.
    # target_vm_name - The name of the VM to be created.
    #
    # Examples
    #
    #   Fission::VM.clone 'foo', 'bar'
    #
    # Returns a Response with the result.
    # If successful, the Response's data attribute will be nil.
    # If there is an error, an unsuccessful Response will be returned.
    def self.clone(source_vm_name, target_vm_name)
      @source_vm = new source_vm_name
      @target_vm = new target_vm_name
      Fission::Action::VM::Cloner.new(@source_vm, @target_vm).clone
    end

    private
    # Internal: Helper for getting the configured vmrun_cmd value.
    #
    # Examples
    #
    #   @vm.vmrun_cmd
    #   # => "/foo/bar/vmrun -T fusion"
    #
    # Returns a String for the configured value of Fission.config['vmrun_cmd'].
    def vmrun_cmd
      Fission.config['vmrun_cmd']
    end

  end
end
