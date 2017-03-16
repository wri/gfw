require 'spec_helper'

describe Fission::Command::Stop do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @stop_response_mock = double('stop_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Stop.new.command_name.should == 'stop'
    end
  end

  describe 'execute' do
    subject { Fission::Command::Stop }

    [ [], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'stop'
    end

    it 'should stop the vm' do
      @stop_response_mock.should_receive(:successful?).and_return(true)
      @vm_mock.should_receive(:stop).and_return(@stop_response_mock)

      command = Fission::Command::Stop.new @target_vm
      command.execute

      @string_io.string.should match /Stopping '#{@target_vm.first}'/
      @string_io.string.should match /VM '#{@target_vm.first}' stopped/
    end

    it 'should output an error and exit if there was an error stopping the vm' do
      @stop_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:stop).and_return(@stop_response_mock)

      command = Fission::Command::Stop.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Stopping '#{@target_vm.first}'/
        @string_io.string.should match /There was an error stopping the VM.+it blew up.+/m
    end
  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Stop.help

      output.should match /fission stop TARGET_VM/
    end
  end
end
