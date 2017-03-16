require 'spec_helper'

describe Fission::Command::Suspend do
  include_context 'command_setup'

  before do
    @target_vm = ['foo']
    Fission::VM.stub(:new).and_return(@vm_mock)

    @suspend_response_mock = double('suspend_response')

    @vm_mock.stub(:name).and_return(@target_vm.first)
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      Fission::Command::Suspend.new.command_name.should == 'suspend'
    end
  end

  describe 'execute' do
    subject { Fission::Command::Suspend }

    [ [], ['--bar'] ].each do |args|
      it_should_not_accept_arguments_of args, 'suspend'
    end

    it 'should suspend the vm' do
      @suspend_response_mock.stub_as_successful

      @vm_mock.should_receive(:suspend).and_return(@suspend_response_mock)

      command = Fission::Command::Suspend.new @target_vm
      command.execute

      @string_io.string.should match /Suspending '#{@target_vm.first}'/
      @string_io.string.should match /VM '#{@target_vm.first}' suspended/
    end

    it 'should output an error and exit if there was an error suspending the vm' do
      @suspend_response_mock.stub_as_unsuccessful

      @vm_mock.should_receive(:suspend).and_return(@suspend_response_mock)

      command = Fission::Command::Suspend.new @target_vm
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /Suspending '#{@target_vm.first}'/
      @string_io.string.should match /There was an error suspending the VM.+it blew up.+/m
    end

    describe 'with --all' do
      before do
        @vm_mock_1 = double('vm_mock_1')
        @vm_mock_2 = double('vm_mock_2')

        @vm_mock_1.stub(:name).and_return('vm_1')
        @vm_mock_2.stub(:name).and_return('vm_2')

        @vm_items = {'vm_1' => @vm_mock_1,
                     'vm_2' => @vm_mock_2
        }
      end

      it 'should output an error and exit if there was an error getting the list of running vms' do
        @all_running_response_mock.stub_as_unsuccessful

        Fission::VM.should_receive(:all_running).and_return(@all_running_response_mock)

        command = Fission::Command::Suspend.new ['--all']
        lambda { command.execute }.should raise_error SystemExit

        @string_io.string.should match /There was an error getting the list of running VMs.+it blew up.+/m
      end

      it 'should suspend all running VMs' do
        @all_running_response_mock.stub_as_successful @vm_items.values
        @suspend_response_mock.stub_as_successful

        Fission::VM.should_receive(:all_running).and_return(@all_running_response_mock)

        @vm_items.each_pair do |name, mock|
          mock.should_receive(:suspend).and_return(@suspend_response_mock)
        end

        command = Fission::Command::Suspend.new ['--all']
        command.execute

        @vm_items.keys.each do |vm|
          @string_io.string.should match /Suspending '#{vm}'/
          @string_io.string.should match /VM '#{vm}' suspended/
        end
      end
    end

  end

  describe 'help' do
    it 'should output info for this command' do
      output = Fission::Command::Suspend.help

      output.should match /fission suspend \[TARGET_VM \| --all\]/
    end
  end
end
