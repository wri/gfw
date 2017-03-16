require 'spec_helper'

describe Fission::Action::VM::Suspender do

  describe 'suspend' do
    before do
      @vm                      = Fission::VM.new 'foo'
      @vmrun_cmd               = Fission.config['vmrun_cmd']
      @conf_file_path          = File.join @vm.path, 'foo.vmx'
      @conf_file_response_mock = double('conf_file_response')
      @running_response_mock   = double('running?')

      @vm.stub(:exists?).and_return(true)
      @vm.stub(:running?).and_return(@running_response_mock)
      @vm.stub(:conf_file).and_return(@conf_file_response_mock)
      @running_response_mock.stub_as_successful true
      @conf_file_response_mock.stub_as_successful @conf_file_path
      @suspender = Fission::Action::VM::Suspender.new @vm
    end

    it "should return an unsuccessful response if the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)
      @suspender.suspend.should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if the vm is not running' do
      @running_response_mock.stub_as_successful false
      @suspender.suspend.should be_an_unsuccessful_response 'VM is not running'
    end

    it 'should return an unsuccessful response if unable to determine if running' do
      @running_response_mock.stub_as_unsuccessful
      @suspender.suspend.should be_an_unsuccessful_response
    end

    it 'should return an unsuccessful response if unable to figure out the conf file' do
      @conf_file_response_mock.stub_as_unsuccessful
      @suspender.suspend.should be_an_unsuccessful_response
    end

    it 'should return a response' do
      executor_mock = double('executor')
      response      = double
      cmd           = "#{@vmrun_cmd} suspend "
      cmd           << "'#{@conf_file_path}' 2>&1"

      executor_mock.should_receive(:execute).and_return(executor_mock)
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(cmd).
                                     and_return(executor_mock)
      Fission::Response.should_receive(:from_shell_executor).
                        with(executor_mock).
                        and_return(response)
      @suspender.suspend.should == response
    end

  end

end
