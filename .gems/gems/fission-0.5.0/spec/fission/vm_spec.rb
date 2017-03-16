require 'spec_helper'

describe Fission::VM do
  before do
    @vm = Fission::VM.new('foo')
    @conf_file_path = File.join(@vm.path, 'foo.vmx')
    @vmrun_cmd = Fission.config['vmrun_cmd']
    @conf_file_response_mock = double('conf_file_response')
  end

  describe 'new' do
    it 'should set the vm name' do
      Fission::VM.new('foo').name.should == 'foo'
    end
  end

  describe 'delete' do
    before do
      @vm_deleter           = double('vm deleter')
      @delete_response_mock = double('vm delete response')
      Fission::Action::VM::Deleter.stub(:new).and_return(@vm_deleter)
      @vm_deleter.should_receive(:delete).
                  and_return(@delete_response_mock)
    end

    it 'should return an unsuccessful response when unable to delete the vm' do
      @delete_response_mock.stub_as_unsuccessful
      @vm.delete.should be_an_unsuccessful_response
    end

    it 'should return a successful response when deleting' do
      @delete_response_mock.stub_as_successful
      @vm.delete.should be_a_successful_response
    end
  end

  describe 'start' do
    before do
      @vm_starter          = double('vm starter')
      @start_response_mock = double('vm start response')
      Fission::Action::VM::Starter.stub(:new).and_return(@vm_starter)
    end

    it 'should return an unsuccessful response when unable to start the vm' do
      @vm_starter.should_receive(:start).
                  and_return(@start_response_mock)
      @start_response_mock.stub_as_unsuccessful
      @vm.start.should be_an_unsuccessful_response
    end

    it 'should return a successful response when starting headless' do
      @vm_starter.should_receive(:start).
                  with(:headless => true).
                  and_return(@start_response_mock)
      @start_response_mock.stub_as_successful
      @vm.start(:headless => true).should be_a_successful_response
    end

    it 'should return a successful response when starting' do
      @vm_starter.should_receive(:start).
                  and_return(@start_response_mock)
      @start_response_mock.stub_as_successful
      @vm.start.should be_a_successful_response
    end
  end

  describe 'stop' do
    before do
      @vm_stopper         = double('vm stopper')
      @stop_response_mock = double('vm stop response')
      Fission::Action::VM::Stopper.stub(:new).and_return(@vm_stopper)
    end

    it 'should return a successful response when stopping' do
      @vm_stopper.should_receive(:stop).
                  and_return(@stop_response_mock)
      @stop_response_mock.stub_as_successful
      @vm.stop.should be_a_successful_response
    end

    it 'should return an unsuccessful response when unable to stop the vm' do
      @vm_stopper.should_receive(:stop).
                  and_return(@stop_response_mock)
      @stop_response_mock.stub_as_unsuccessful
      @vm.stop.should be_an_unsuccessful_response
    end

    it 'should return a successful response when stopping hard' do
      @vm_stopper.should_receive(:stop).
                  with(:hard => true).
                  and_return(@stop_response_mock)
      @stop_response_mock.stub_as_successful
      @vm.stop(:hard => true).should be_a_successful_response
    end
  end

  describe 'suspend' do
    before do
      @vm_suspender          = double('vm suspender')
      @suspend_response_mock = double('vm suspend response')
      Fission::Action::VM::Suspender.stub(:new).and_return(@vm_suspender)
      @vm_suspender.should_receive(:suspend).
                    and_return(@suspend_response_mock)
    end

    it 'should return a successful response when suspending' do
      @suspend_response_mock.stub_as_successful
      @vm.suspend.should be_a_successful_response
    end

    it 'should return an unsuccessful response when unable to suspend the vm' do
      @suspend_response_mock.stub_as_unsuccessful
      @vm.suspend.should be_an_unsuccessful_response
    end
  end

  describe 'snapshots' do
    before do
      @snapshot_lister_mock = double('snapshot lister')
      @snapshots_response_mock = double('snapshots mock')
      Fission::Action::Snapshot::Lister.stub(:new).and_return(@snapshot_lister_mock)
      @snapshot_lister_mock.should_receive(:snapshots).
                            and_return(@snapshots_response_mock)
    end

    it "should return an unsuccessful repsonse when unable to list the snapshots" do
      @snapshots_response_mock.stub_as_unsuccessful
      @vm.snapshots.should be_an_unsuccessful_response
    end

    it 'should return a successful response with the list of snapshots' do
      @snapshots_response_mock.stub_as_successful ['snap_1', 'snap_2']
      response = @vm.snapshots
      response.should be_a_successful_response
      response.data.should == ['snap_1', 'snap_2']
    end
  end

  describe 'create_snapshot' do
    before do
      @snapshot_creator_mock         = double('snapshot creator')
      @snapshot_create_response_mock = double('snapshot create response')
      Fission::Action::Snapshot::Creator.stub(:new).and_return(@snapshot_creator_mock)
      @snapshot_creator_mock.should_receive(:create_snapshot).
                             with('snap_1').
                             and_return(@snapshot_create_response_mock)
    end

    it 'should return an unsuccessful response when unable to create the snapshot' do
      @snapshot_create_response_mock.stub_as_unsuccessful
      @vm.create_snapshot('snap_1').should be_an_unsuccessful_response
    end

    it 'should return a successful response when creating the snapshot' do
      @snapshot_create_response_mock.stub_as_successful
      @vm.create_snapshot('snap_1').should be_a_successful_response
    end
  end

  describe 'delete_snapshot' do
    before do
      @snapshot_deleter_mock         = double('snapshot deleter')
      @snapshot_delete_response_mock = double('snapshot delete response')

      Fission::Action::Snapshot::Deleter.stub(:new).
                                       and_return(@snapshot_deleter_mock)
      @snapshot_deleter_mock.should_receive(:delete_snapshot).
                             with('snap_1').
                             and_return(@snapshot_delete_response_mock)
    end

    it 'should return an unsuccessful response when unable to delete the snapshot' do
      @snapshot_delete_response_mock.stub_as_unsuccessful
      @vm.delete_snapshot('snap_1').should be_an_unsuccessful_response
    end

    it 'should return a successful response when deleteing the snapshot' do
      @snapshot_delete_response_mock.stub_as_successful
      @vm.delete_snapshot('snap_1').should be_a_successful_response
    end
  end

  describe 'revert_to_snapshot' do
    before do
      @snapshot_reverter_mock       = double('snapshot reverter')
      @snapshot_revert_response_mock = 'snapshot revert response'

      Fission::Action::Snapshot::Reverter.stub(:new).
                                        and_return(@snapshot_reverter_mock)
      @snapshot_reverter_mock.should_receive(:revert_to_snapshot).
                              with('snap_1').
                              and_return(@snapshot_revert_response_mock)
    end

    it 'should return an unsuccessful response when unable to revert the snapshot' do
      @snapshot_revert_response_mock.stub_as_unsuccessful
      @vm.revert_to_snapshot('snap_1').should be_an_unsuccessful_response
    end

    it 'should return a successful response when reverting the snapshot' do
      @snapshot_revert_response_mock.stub_as_successful
      @vm.revert_to_snapshot('snap_1').should be_a_successful_response
    end
  end

  describe 'exists?' do
    before do
      @conf_file_response = double('exists')
      @vm.stub(:conf_file).and_return(@conf_file_response)
    end

    it 'should return true if the VM exists' do
      @conf_file_response.stub_as_successful '/vms/foo/foo.vmx'
      @vm.exists?.should == true
    end

    it 'should return false if the VM does not exist' do
      @conf_file_response.stub_as_unsuccessful
      @vm.exists?.should == false
    end
  end

  describe 'hardware_info' do
    before do
      @vm_config_data_response_mock = double('vm config data response')
      @vm.stub(:conf_file_data).and_return(@vm_config_data_response_mock)
      @config_data = { 'numvcpus'         => '2',
                       'replay.supported' => "TRUE",
                       'replay.filename'  => '',
                       'memsize'          => '2048',
                       'scsi0:0.redo'     => '' }
    end

    context 'when successful getting the vm config data' do
      before do
        @vm_config_data_response_mock.stub_as_successful @config_data
      end

      context 'when the number of cpus is not specified in the conf file' do
        before do
         @config_data.delete 'numvcpus'
        end

        it 'should return a successful response with a single cpu' do
          response = @vm.hardware_info

          response.should be_a_successful_response
          response.data.should have_key 'cpus'
          response.data['cpus'].should == 1
        end
      end

      it 'should return a successful response with the number of cpus' do
        response = @vm.hardware_info

        response.should be_a_successful_response
        response.data.should have_key 'cpus'
        response.data['cpus'].should == 2
      end

      it 'should return a successful response with the amount of memory' do
        response = @vm.hardware_info

        response.should be_a_successful_response
        response.data.should have_key 'memory'
        response.data['memory'].should == 2048
      end
    end

    context 'when unsuccessfully getting the vm config data' do
      it 'should return an unsuccessful response' do
        @vm_config_data_response_mock.stub_as_unsuccessful
        @vm.hardware_info.should be_an_unsuccessful_response
      end
    end

  end

  describe 'mac_addresses' do
    before do
      @network_info_mock = double('network_info')
      @vm.should_receive(:network_info).and_return(@network_info_mock)
    end

    it 'should return a successful response with the list of mac addresses' do
      network_data = { 'ethernet0' => { 'mac_address' => '00:0c:29:1d:6a:64',
                                        'ip_address'  => '127.0.0.1' },
                       'ethernet1' => { 'mac_address' => '00:0c:29:1d:6a:75',
                                        'ip_address'  => '127.0.0.2' } }
      @network_info_mock.stub_as_successful network_data

      response = @vm.mac_addresses

      response.should be_a_successful_response
      response.data.should =~ ['00:0c:29:1d:6a:64', '00:0c:29:1d:6a:75']
    end

    it 'should return a successful response with an empty list if no mac addresses were found' do
      @network_info_mock.stub_as_successful Hash.new

      response = @vm.mac_addresses

      response.should be_a_successful_response
      response.data.should == []
    end

    it 'should return an unsuccessful response if there was an error getting the mac addresses' do
      @network_info_mock.stub_as_unsuccessful

      response = @vm.mac_addresses

      response.should be_an_unsuccessful_response
      response.data.should be_nil
    end

  end

  describe 'network_info' do
    before do
      @lease_1_response_mock = double('lease_1_response')
      @lease_2_response_mock = double('lease_1_response')
      @vm_config_data_response_mock = double('vm config data response')

      @vm.stub(:conf_file_data).and_return(@vm_config_data_response_mock)
      @config_data = { 'ide1:0.deviceType'                   => 'cdrom-image',
                       'ethernet0.present'                    => 'TRUE',
                       'ethernet1.address'                    => '00:0c:29:1d:6a:75',
                       'ethernet0.connectionType'             => 'nat',
                       'ethernet0.generatedAddress'           => '00:0c:29:1d:6a:64',
                       'ethernet0.virtualDev'                 => 'e1000',
                       'ethernet0.wakeOnPcktRcv'              => 'FALSE',
                       'ethernet0.addressType'                => 'generated',
                       'ethernet0.linkStatePropagatio.enable' => 'TRUE',
                       'ethernet0.generatedAddressenable'     => 'TRUE',
                       'ethernet1.generatedAddressenable'     => 'TRUE' }
    end

    context 'when successful getting the vm config data' do
      before do
        @vm_config_data_response_mock.stub_as_successful @config_data
      end

      it 'should return a successful response with the list of interfaces, macs, and ips' do
        @lease_1 = Fission::Lease.new :ip_address  => '127.0.0.1',
                                      :mac_address => '00:0c:29:1d:6a:64'
        @lease_1_response_mock.stub_as_successful @lease_1

        @lease_2 = Fission::Lease.new :ip_address  => '127.0.0.2',
                                      :mac_address => '00:0c:29:1d:6a:75'
        @lease_2_response_mock.stub_as_successful @lease_2

        Fission::Lease.should_receive(:find_by_mac_address).
                       with('00:0c:29:1d:6a:64').
                       and_return(@lease_1_response_mock)
        Fission::Lease.should_receive(:find_by_mac_address).
                       with('00:0c:29:1d:6a:75').
                       and_return(@lease_2_response_mock)

        response = @vm.network_info
        response.should be_a_successful_response
        response.data.should == { 'ethernet0' => { 'mac_address'  => '00:0c:29:1d:6a:64',
                                                   'ip_address'   => '127.0.0.1' },
                                  'ethernet1' => { 'mac_address'  => '00:0c:29:1d:6a:75',
                                                   'ip_address'   => '127.0.0.2' } }
      end

      it 'should return a successful response with an empty list if there are no macs' do
        @config_data.delete 'ethernet0.generatedAddress'
        @config_data.delete 'ethernet1.address'

        response = @vm.network_info
        response.should be_a_successful_response
        response.data.should == {}
      end

      it 'should return a successful response without ip addresses if none were found' do
        @lease_1_response_mock.stub_as_successful nil
        @lease_2_response_mock.stub_as_successful nil

        Fission::Lease.should_receive(:find_by_mac_address).
                       with('00:0c:29:1d:6a:64').
                       and_return(@lease_1_response_mock)
        Fission::Lease.should_receive(:find_by_mac_address).
                       with('00:0c:29:1d:6a:75').
                       and_return(@lease_2_response_mock)

        response = @vm.network_info
        response.should be_a_successful_response
        response.data.should == { 'ethernet0' => { 'mac_address'  => '00:0c:29:1d:6a:64',
                                                   'ip_address'   => nil },
                                  'ethernet1' => { 'mac_address'  => '00:0c:29:1d:6a:75',
                                                   'ip_address'   => nil } }
      end

      context 'when unsuccessful getting the ip info' do
        it 'should return an unsuccessful response if there was an error getting the ip information' do
          @lease_1_response_mock.stub_as_unsuccessful
          @lease_2_response_mock.stub_as_successful nil

          Fission::Lease.should_receive(:find_by_mac_address).
                         with('00:0c:29:1d:6a:64').
                         and_return(@lease_1_response_mock)
          Fission::Lease.should_receive(:find_by_mac_address).
                         with('00:0c:29:1d:6a:75').
                         and_return(@lease_2_response_mock)

          @vm.network_info.should be_an_unsuccessful_response
        end
      end

    end

    context 'when unsuccessfully getting the vm config data' do
      it 'should return an unsuccessful response' do
        @vm_config_data_response_mock.stub_as_unsuccessful
        @vm.guestos.should be_an_unsuccessful_response
      end
    end

  end

  describe 'guestos' do
    before do
      @vm_config_data_response_mock = double('vm config data response')
      @vm.stub(:conf_file_data).and_return(@vm_config_data_response_mock)
      @config_data = { 'cleanShutdown'   => 'TRUE',
                       'guestOS'         => 'debian5',
                       'replay.filename' => '',
                       'scsi0:0.redo'    => '' }
    end

    context 'when successful getting the vm config data' do
      it 'should return a successful response with a string when a guestos is defined' do
        @vm_config_data_response_mock.stub_as_successful @config_data

        response = @vm.guestos
        response.should be_a_successful_response
        response.data.should == 'debian5'
      end

      it 'should return a successful response with an empty string if guestos is not set' do
        @config_data.delete 'guestOS'
        @vm_config_data_response_mock.stub_as_successful @config_data

        response = @vm.guestos
        response.should be_a_successful_response
        response.data.should == ''
      end
    end

    context 'when unsuccessfully getting the vm config data' do
      it 'should return an unsuccessful response' do
        @vm_config_data_response_mock.stub_as_unsuccessful
        @vm.guestos.should be_an_unsuccessful_response
      end
    end
  end

  describe 'uuids' do
    before do
      @vm_config_data_response_mock = double('vm config data response')
      @vm.stub(:conf_file_data).and_return(@vm_config_data_response_mock)
      @config_data = { 'uuid.location' => '56 4d d8 9c f8 ec 95 73-2e ea a0 f3 7a 1d 6f c8',
                       'uuid.bios' => '56 4d d8 9c f8 ec 95 73-2e ea a0 f3 7a 1d 6f c8',
                       'checkpoint.vmState' => '',
                       'cleanShutdown' => 'TRUE',
                       'replay.supported' => "TRUE",
                       'replay.filename' => '',
                       'scsi0:0.redo' =>'' }
    end

    context 'when successful getting the vm config data' do
      it 'should return a successful response with a hash when uuids are defined' do
        @vm_config_data_response_mock.stub_as_successful @config_data

        response = @vm.uuids
        response.should be_a_successful_response
        response.data.should == { 'bios'     => '56 4d d8 9c f8 ec 95 73-2e ea a0 f3 7a 1d 6f c8',
                                  'location' => '56 4d d8 9c f8 ec 95 73-2e ea a0 f3 7a 1d 6f c8' }
      end

      it 'should return a successful response with empty hash if no uuids are defined' do
        ['location', 'bios'].each { |i| @config_data.delete "uuid.#{i}" }
        @vm_config_data_response_mock.stub_as_successful @config_data

        response = @vm.uuids
        response.should be_a_successful_response
        response.data.should == {}
      end
    end

    context 'when unsuccessfully getting the vm config data' do
      it 'should return an unsuccessful response' do
        @vm_config_data_response_mock.stub_as_unsuccessful
        @vm.uuids.should be_an_unsuccessful_response
      end
    end

  end

  describe 'path' do
    it 'should return the path of the VM' do
      vm_path = File.join(Fission.config['vm_dir'], 'foo.vmwarevm').gsub '\\', ''
      Fission::VM.new('foo').path.should == vm_path
    end
  end

  describe 'state' do
    before do
      @vm_1 = Fission::VM.new 'foo'
      @vm_2 = Fission::VM.new 'bar'

      @all_running_response_mock = double('all_running')
      @suspended_response_mock = double('suspended')

      Fission::VM.stub(:all_running).and_return(@all_running_response_mock)
      @all_running_response_mock.stub_as_successful [@vm_2]
    end

    it "should return a successful response and 'not running' when the VM is off" do
      response = @vm.state
      response.should be_a_successful_response
      response.data.should == 'not running'
    end

    it "should return a successful resopnse and 'running' when the VM is running" do
      @all_running_response_mock.stub_as_successful [@vm_1, @vm_2]

      response = @vm.state
      response.should be_a_successful_response
      response.data.should == 'running'
    end

    it "should return a successful response and 'suspended' when the VM is suspended" do
      @suspended_response_mock.stub_as_successful true

      @vm.stub(:suspended?).and_return(@suspended_response_mock)

      response = @vm.state
      response.should be_a_successful_response
      response.data.should == 'suspended'
    end

    it 'should return an unsuccessful response if there was an error getting the running VMs' do
      @all_running_response_mock.stub_as_unsuccessful
      @vm.state.should be_an_unsuccessful_response
    end

    it 'should return an unsuccessful repsonse if there was an error determining if the VM is suspended' do
      @suspended_response_mock.stub_as_unsuccessful
      @vm.stub(:suspended?).and_return(@suspended_response_mock)
      @vm.state.should be_an_unsuccessful_response
    end
  end

  describe 'running?' do
    before do
      @all_running_response_mock = double('all_running')

      Fission::VM.stub(:all_running).and_return(@all_running_response_mock)
    end

    it 'should return a successful response and false when the vm is not running' do
      @all_running_response_mock.stub_as_successful []
      response = @vm.running?
      response.should be_a_successful_response
      response.data.should == false
    end

    it 'should return a successful response and true if the vm is running' do
      @all_running_response_mock.stub_as_successful [Fission::VM.new('foo')]

      response = @vm.running?
      response.should be_a_successful_response
      response.data.should == true
    end

    it 'should return an unsuccessful repsponse if there is an error getting the list of running vms' do
      @all_running_response_mock.stub_as_unsuccessful
      @vm.running?.should be_an_unsuccessful_response
    end

  end

  describe 'suspend_file_exists?' do
    before do
      FakeFS.activate!
      FileUtils.mkdir_p @vm.path
    end

    after do
      FakeFS.deactivate!
      FakeFS::FileSystem.clear
    end

    it 'should return true if the suspend file exists' do
      FileUtils.touch(File.join(@vm.path, "#{@vm.name}.vmem"))
      @vm.suspend_file_exists?.should == true
    end

    it 'should return false if the suspend file does not exist' do
      @vm.suspend_file_exists?.should == false
    end

  end

  describe 'suspended?' do
    before do
      @running_response_mock = double('running?')
      @vm.stub(:running?).and_return(@running_response_mock)
    end

    describe 'when the vm is not running' do
      before do
        @running_response_mock.stub_as_successful false
      end

      it 'should return a successful response and true if a .vmem file exists in the vm dir' do
        @vm.stub(:suspend_file_exists?).and_return(true)

        response = @vm.suspended?
        response.should be_a_successful_response
        response.data.should == true
      end

      it 'should return a successful response and false if a .vmem file is not found in the vm dir' do
        @vm.stub(:suspend_file_exists?).and_return(false)

        response = @vm.suspended?
        response.should be_a_successful_response
        response.data.should == false
      end
    end

    it 'should return a successful response and false if the vm is running' do
      @running_response_mock.stub_as_successful true

      response = @vm.suspended?
      response.should be_a_successful_response
      response.data.should == false
    end

    it 'should return an unsuccessful repsponse if there is an error getting the list of running vms' do
      @running_response_mock.stub_as_unsuccessful
      @vm.suspended?.should be_an_unsuccessful_response
    end

  end

  describe 'conf_file_data' do
    before do
      @vm_config_mock          = double('vm config')
      @vm_config_response_mock = double('vm config response')

      Fission::VMConfiguration.should_receive(:new).with(@vm).
                                                    and_return(@vm_config_mock)
    end

    it 'should return a successful response with the data' do
      @vm_config_response_mock.stub_as_successful({ 'numvcpus' => '2' })

      @vm_config_mock.should_receive(:config_data).
                      and_return(@vm_config_response_mock)
      config_data = @vm.conf_file_data
      config_data.should be_a_successful_response
      config_data.data.should == { 'numvcpus' => '2' }
    end

    it 'should return an unsuccessful response' do
      @vm_config_mock.should_receive(:config_data).
                      and_return(@vm_config_response_mock)
      @vm_config_response_mock.stub_as_unsuccessful
      @vm.conf_file_data.should be_an_unsuccessful_response
    end
  end

  describe 'conf_file' do
    before do
      FakeFS.activate!
      @vm_root_dir = Fission::VM.new('foo').path
      FileUtils.mkdir_p(@vm_root_dir)
    end

    after do
      FakeFS.deactivate!
      FakeFS::FileSystem.clear
    end

    it 'should return a successful response with the path to the conf file' do
      file_path = File.join(@vm_root_dir, 'foo.vmx')
      FileUtils.touch(file_path)

      response = Fission::VM.new('foo').conf_file
      response.should be_a_successful_response
      response.data.should == file_path
    end

    it 'should return an unsuccessful response with an error if no vmx file was found' do
      response = Fission::VM.new('foo').conf_file
      response.successful?.should == false
      response.message.should match /Unable to find a config file for VM 'foo' \(in '#{File.join(@vm_root_dir, '\*\.vmx')}'\)/m
    end

    describe 'when the VM name and conf file name do not match' do
      it 'should return the path to the conf file' do
        file_path = File.join(@vm_root_dir, 'bar.vmx')
        FileUtils.touch(file_path)

        response = Fission::VM.new('foo').conf_file
        response.should be_a_successful_response
        response.data.should == file_path
      end
    end

    describe 'if multiple vmx files are found' do
      it 'should use return a successful response with the conf file which matches the VM name if it exists' do
        ['foo.vmx', 'bar.vmx'].each do |file|
          FileUtils.touch(File.join(@vm_root_dir, file))
        end

        response = Fission::VM.new('foo').conf_file
        response.should be_a_successful_response
        response.data.should == File.join(@vm_root_dir, 'foo.vmx')
      end

      it 'should return an unsuccessful object if none of the conf files matches the VM name' do
        ['bar.vmx', 'baz.vmx'].each do |file|
          FileUtils.touch(File.join(@vm_root_dir, file))
        end
        Fission::VM.new('foo').conf_file

        response = Fission::VM.new('foo').conf_file
        response.successful?.should == false
        error_regex = /Multiple config files found for VM 'foo' \('bar\.vmx', 'baz\.vmx' in '#{@vm_root_dir}'/m
        response.message.should match error_regex
      end
    end

  end

  describe "self.all" do
    before do
      @lister            = double('lister')
      @all_response_mock = double('all response')
      Fission::Action::VM::Lister.stub(:new).and_return(@lister)
      @lister.should_receive(:all).
              and_return(@all_response_mock)
    end

    it 'should return an unsuccessful response when unable to delete the vm' do
      @all_response_mock.stub_as_unsuccessful
      Fission::VM.all.should be_an_unsuccessful_response
    end

    it 'should return a successful response when deleting' do
      @all_response_mock.stub_as_successful
      Fission::VM.all.should be_a_successful_response
    end
  end

  describe 'self.all_running' do
    before do
      @lister                    = double('lister')
      @all_running_response_mock = double('all running response')
      Fission::Action::VM::Lister.stub(:new).and_return(@lister)
      @lister.should_receive(:all_running).
              and_return(@all_running_response_mock)
    end

    it 'should return an unsuccessful response when unable to delete the vm' do
      @all_running_response_mock.stub_as_unsuccessful
      Fission::VM.all_running.should be_an_unsuccessful_response
    end

    it 'should return a successful response when deleting' do
      @all_running_response_mock.stub_as_successful
      Fission::VM.all_running.should be_a_successful_response
    end
  end

  describe "self.clone" do
    before do
      @vm_1                = double('vm 1')
      @vm_2                = double('vm 2')
      @vm_cloner           = double('vm cloner')
      @clone_response_mock = double('vm clone response')
      Fission::Action::VM::Cloner.should_receive(:new).
                                with(@vm_1, @vm_2).
                                and_return(@vm_cloner)
      Fission::VM.should_receive(:new).with('vm_1').and_return(@vm_1)
      Fission::VM.should_receive(:new).with('vm_2').and_return(@vm_2)
      @vm_cloner.should_receive(:clone).
                 and_return(@clone_response_mock)
    end

    it 'should return an unsuccessful response when unable to clone the vm' do
      @clone_response_mock.stub_as_unsuccessful
      Fission::VM.clone('vm_1', 'vm_2').should be_an_unsuccessful_response
    end

    it 'should return a successful response when cloning' do
      @clone_response_mock.stub_as_successful
      Fission::VM.clone('vm_1', 'vm_2').should be_a_successful_response
    end
  end

  describe 'self.all_with_status' do
    before do
      @lister                   = double('lister')
      @all_status_response_mock = double('all status response')
      Fission::Action::VM::Lister.stub(:new).and_return(@lister)
      @lister.should_receive(:all_with_status).
              and_return(@all_status_response_mock)
    end

    it 'should return an unsuccessful response when unable to delete the vm' do
      @all_status_response_mock.stub_as_unsuccessful
      Fission::VM.all_with_status.should be_an_unsuccessful_response
    end

    it 'should return a successful response when deleting' do
      @all_status_response_mock.stub_as_successful
      Fission::VM.all_with_status.should be_a_successful_response
    end

  end

end
