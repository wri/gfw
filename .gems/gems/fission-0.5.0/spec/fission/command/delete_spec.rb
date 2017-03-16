require 'spec_helper'

describe Fission::Command::Delete do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @delete_response_mock = double('delete_response')
    @running_response_mock = double('running?')

    @vm_mock.stub(:name).and_return(@target_vm.first)
    @vm_mock.stub(:running?).and_return(@running_response_mock)
    @running_response_mock.stub_as_successful false
    Fission::Fusion.stub(:running?).and_return(false)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Delete.new.command_name.should == 'delete'
    end
  end

  describe "execute" do
    subject { Fission::Command::Delete }

    [ [], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'delete'
    end

    it "should try to delete the vm" do
      @delete_response_mock.stub_as_successful

      @vm_mock.should_receive(:delete).and_return(@delete_response_mock)

      Fission::Fusion.should_receive(:running?).and_return(false)

      command = Fission::Command::Delete.new @target_vm
      command.execute

      @string_io.string.should match /Deletion complete/
    end

    it "should output an error and exit if unable to determine if it's running" do
      @running_response_mock.stub_as_unsuccessful

      command = Fission::Command::Delete.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error determining if the VM is running.+it blew up.+/m
    end

    it 'should output an error and exit if there was an error deleting the VM' do
      @delete_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:delete).and_return(@delete_response_mock)

      command = Fission::Command::Delete.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /There was an error deleting the VM.+it blew up/m
    end

    it 'should output an error and exit if the VM is running' do
      @running_response_mock.stub_as_successful true

      command = Fission::Command::Delete.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /VM is currently running/
      @string_io.string.should match /Either stop\/suspend the VM or use '--force' and try again/
    end

    it 'should output an error and exit if the fusion app is running' do
      Fission::Fusion.stub(:running?).and_return(true)

      command = Fission::Command::Delete.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Fusion GUI is currently running/
      @string_io.string.should match /Either exit the Fusion GUI or use '--force' and try again/
      @string_io.string.should match /NOTE: Forcing a VM deletion with the Fusion GUI running may not clean up all of the VM metadata/
    end

    describe 'with --force' do
      before do
        @vm_mock.should_receive(:delete).and_return(@delete_response_mock)
        @delete_response_mock.stub_as_successful true
      end

      it "should stop the VM if it's running and then delete it" do
        @stop_cmd_mock = double('stop_cmd')

        @stop_cmd_mock.should_receive(:execute)
        @running_response_mock.stub_as_successful true

        Fission::Command::Stop.should_receive(:new).with(@target_vm).
                               and_return(@stop_cmd_mock)
        command = Fission::Command::Delete.new @target_vm << '--force'
        command.execute

        @string_io.string.should match /VM is currently running/
        @string_io.string.should match /Going to stop it/
        @string_io.string.should match /Deletion complete/
      end

      it 'should output a warning about fusion metadata issue and then delete the VM' do

        Fission::Fusion.should_receive(:running?).and_return(true)
        command = Fission::Command::Delete.new @target_vm << '--force'
        command.execute

        @string_io.string.should match /Fusion GUI is currently running/
        @string_io.string.should match /metadata for the VM may not be removed completely/
        @string_io.string.should match /Deletion complete/
      end
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Delete.help

      output.should match /fission delete TARGET_VM \[OPTIONS\]/
      output.should match /--force/
    end
  end
end
