require 'spec_helper'

describe Fission::Command::SnapshotDelete do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @snap_delete_response_mock = double('snap_delete_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::SnapshotDelete.new.command_name.should == 'snapshot delete'
    end
  end

  describe 'execute' do
    subject { Fission::Command::SnapshotDelete }

    [ [], ['foo'], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'snapshot delete'
    end

    it "should output an error and the help when no snapshot name is passed in" do
      Fission::Command::SnapshotDelete.should_receive(:help)

      command = Fission::Command::SnapshotDelete.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Incorrect arguments for snapshot delete command/
    end

    it 'should delete a new snapshot with the provided name' do
      @snap_delete_response_mock.stub_as_successful []

      @vm_mock.should_receive(:delete_snapshot).
               with('snap_1').
               and_return(@snap_delete_response_mock)

      command = Fission::Command::SnapshotDelete.new @target_vm << 'snap_1'
      command.execute

      @string_io.string.should match /Deleting snapshot/
      @string_io.string.should match /Snapshot 'snap_1' deleted/
    end

    it 'should output an error and exit if there was an error creating the snapshot' do
      @snap_delete_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:delete_snapshot).
               with('snap_1').
               and_return(@snap_delete_response_mock)

      command = Fission::Command::SnapshotDelete.new @target_vm << 'snap_1'
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Deleting snapshot/
      @string_io.string.should match /There was an error deleting the snapshot.+it blew up.+/m
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::SnapshotDelete.help

      output.should match /fission snapshot delete TARGET_VM SNAPSHOT_NAME/
    end
  end
end
