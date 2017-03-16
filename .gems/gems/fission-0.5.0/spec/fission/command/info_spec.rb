require 'spec_helper'

describe Fission::Command::Info do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @network_info_response_mock = double('network_info_response')
    @hardware_info_response_mock = double('hardware_info_response')
    @guest_os_response_mock = double('guest_os_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Info.new.command_name.should == 'info'
    end
  end

  describe 'execute' do
    before do
      @vm_mock.stub(:network_info).and_return(@network_info_response_mock)
      @vm_mock.stub(:hardware_info).and_return(@hardware_info_response_mock)
      @vm_mock.stub(:guestos).and_return(@guest_os_response_mock)
      @network_info = { 'ethernet0' => { 'mac_address'  => '00:11:22:33:AA:BB',
                                         'ip_address'   => '192.168.1.10' },
                        'ethernet1' => { 'mac_address'  => '00:11:22:33:AA:BB',
                                         'ip_address'   => '192.168.1.10' } }
      @hardware_info_response_mock.stub_as_successful Hash.new
      @network_info_response_mock.stub_as_successful Hash.new
      @guest_os_response_mock.stub_as_successful 'debian5'
    end

    subject { Fission::Command::Info }

    [ [], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'info'
    end

    it 'should output the vm name' do
      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /foo/
    end

    it 'should output the os' do
      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /os: debian5/
    end

    it 'should output that the os is unknown if applicable' do
      @guest_os_response_mock.stub_as_successful ''
      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /os: unknown/
    end

    it 'should output an error and exit if there was an error getting the os info' do
      @guest_os_response_mock.stub_as_unsuccessful

      command = Fission::Command::Info.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error getting the OS info.+it blew up.+/m
    end

    it 'should output the number of cpus' do
      hardware_info = { 'cpus' => 2}
      @hardware_info_response_mock.stub_as_successful hardware_info

      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /cpus\: 2/
    end

    it 'should output the amount of memory' do
      hardware_info = { 'memory' => 2048}
      @hardware_info_response_mock.stub_as_successful hardware_info

      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /memory\: 2048/
    end

    it 'should output an error and exit if there was an error getting the hardware info' do
      @hardware_info_response_mock.stub_as_unsuccessful

      command = Fission::Command::Info.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error getting the hardware info.+it blew up.+/m
    end

    it 'should output the network info' do
      @network_info_response_mock.stub_as_successful @network_info

      command = Fission::Command::Info.new @target_vm
      command.execute

      @string_io.string.should match /ethernet0 mac address: 00:11:22:33:AA:BB/
      @string_io.string.should match /ethernet0 ip address: 192\.168\.1\.10/
    end

    it 'should output an error and exit if there was an error getting the network info' do
      @network_info_response_mock.stub_as_unsuccessful

      command = Fission::Command::Info.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error getting the network info.+it blew up.+/m
    end
  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Info.help

      output.should match /fission info TARGET_VM/
    end
  end
end
