require 'spec_helper'

describe Fission::Command::Start do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @start_response_mock = double('start_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Start.new.command_name.should == 'start'
    end
  end

  describe 'execute' do
    subject { Fission::Command::Start }

    [ [], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'start'
    end

    it 'should output an error and exit if there was an error starting the vm' do
      @start_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:start).and_return(@start_response_mock)

      command = Fission::Command::Start.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Starting '#{@target_vm.first}'/
      @string_io.string.should match /There was a problem starting the VM.+it blew up.+/m
    end

    describe 'with --headless' do
      it 'should start the vm headless' do
        @start_response_mock.stub_as_successful

        @vm_mock.should_receive(:start).and_return(@start_response_mock)

        command = Fission::Command::Start.new @target_vm << '--headless'
        command.execute

        @string_io.string.should match /Starting '#{@target_vm.first}'/
          @string_io.string.should match /VM '#{@target_vm.first}' started/
      end
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Start.help

      output.should match /fission start TARGET_VM \[OPTIONS\]/
      output.should match /--headless/
    end
  end
end
