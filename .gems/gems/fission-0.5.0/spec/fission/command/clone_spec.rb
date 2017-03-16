require 'spec_helper'

describe Fission::Command::Clone do
  include_context 'command_setup'

  before do
    @vm_info = ['foo', 'bar']
    @source_vm_mock = double('source_vm')
    @target_vm_mock = double('target_vm')

    @clone_response_mock = double('clone_reponse')
    @start_response_mock = double('start_reponse')

    @source_vm_mock.stub(:name).and_return('foo')
    @target_vm_mock.stub(:name).and_return('bar')

    Fission::VM.stub(:new).with('foo').and_return(@source_vm_mock)
    Fission::VM.stub(:new).with('bar').and_return(@target_vm_mock)
    Fission::VM.stub(:clone).with(@vm_info.first, @vm_info[1]).
                             and_return(@clone_response_mock)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Clone.new.command_name.should == 'clone'
    end
  end

  describe 'execute' do
   subject { Fission::Command::Clone }

    [ [], ['foo'], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'clone'
    end

    it 'should clone the vm' do
      @clone_response_mock.stub_as_successful

      command = Fission::Command::Clone.new @vm_info
      command.execute

      @string_io.string.should match /Clone complete/
    end

    it 'should output an error and exit if there is an error cloning' do
      @clone_response_mock.stub_as_unsuccessful

      command = Fission::Command::Clone.new @vm_info
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error cloning the VM.+it blew up/m
    end

    describe 'with --start' do
      before do
        @clone_response_mock.stub_as_successful true
        @target_vm_mock.should_receive(:start).and_return(@start_response_mock)
      end

      it 'should clone the vm and start it' do
        @start_response_mock.stub_as_successful

        command = Fission::Command::Clone.new @vm_info << '--start'
        command.execute

        @string_io.string.should match /Clone complete/
        @string_io.string.should match /Starting '#{@vm_info[1]}'/
        @string_io.string.should match /VM '#{@vm_info[1]}' started/
      end

      it 'should output an error and exit if there is an error starting the VM after cloning it' do
        @start_response_mock.stub_as_unsuccessful

        command = Fission::Command::Clone.new @vm_info << '--start'
        lambda { command.execute }.should raise_error SystemExit

        @string_io.string.should match /Clone complete/
        @string_io.string.should match /Starting '#{@vm_info[1]}'/
        @string_io.string.should match /There was an error starting the VM.+it blew up/m
      end
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Clone.help

      output.should match /fission clone SOURCE_VM TARGET_VM.+OPTIONS/m
    end
  end
end
