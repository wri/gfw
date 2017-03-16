require 'spec_helper'

describe Fission::Command::SnapshotRevert do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @snap_revert_response_mock = double('snap_revert_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::SnapshotRevert.new.command_name.should == 'snapshot revert'
    end
  end

  describe 'execute' do
    subject { Fission::Command::SnapshotRevert }

    [ [], ['foo'], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'snapshot revert'
    end

    it "should output an error and the help when no snapshot name is passed in" do
      Fission::Command::SnapshotRevert.should_receive(:help)

      command = Fission::Command::SnapshotRevert.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Incorrect arguments for snapshot revert command/
    end

    it 'should revert to the snapshot with the provided name' do
      @snap_revert_response_mock.stub_as_successful

      @vm_mock.should_receive(:revert_to_snapshot).with('snap_1').
               and_return(@snap_revert_response_mock)

      command = Fission::Command::SnapshotRevert.new @target_vm << 'snap_1'
      command.execute

      @string_io.string.should match /Reverting to snapshot 'snap_1'/
      @string_io.string.should match /Reverted to snapshot 'snap_1'/
    end

    it 'should output an error and exit if there was an error reverting to the snapshot' do
      @snap_revert_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:revert_to_snapshot).with('snap_1').
               and_return(@snap_revert_response_mock)

      command = Fission::Command::SnapshotRevert.new @target_vm << 'snap_1'
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Reverting to snapshot 'snap_1'/
      @string_io.string.should match /There was an error reverting to the snapshot.+it blew up.+/m
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::SnapshotRevert.help

      output.should match /fission snapshot revert TARGET_VM TARGET_SNAPSHOT/
    end
  end
end
