require 'spec_helper'

describe Fission::Action::Snapshot::Deleter do

  describe 'delete_snapshot' do
    before do
      @vm                      = Fission::VM.new 'foo'
      @conf_file_path          = File.join @vm.path, 'foo.vmx'
      @vmrun_cmd               = Fission.config['vmrun_cmd']
      @conf_file_response_mock = double('conf_file_response')
      @snapshots_response_mock = double('snapshots')
      @running_response_mock   = double('running?')

      @running_response_mock.stub_as_successful true
      @conf_file_response_mock.stub_as_successful @conf_file_path
      @snapshots_response_mock.stub_as_successful ['snap_1']

      @vm.stub(:exists?).and_return(true)
      @vm.stub(:snapshots).and_return(@snapshots_response_mock)
      @vm.stub(:running?).and_return(@running_response_mock)
      @vm.stub(:conf_file).and_return(@conf_file_response_mock)
      Fission::Fusion.stub(:running?).and_return(false)
      @deleter = Fission::Action::Snapshot::Deleter.new @vm
    end

    it "should return an unsuccessful response if the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)
      @deleter.delete_snapshot('snap_1').should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if unable to figure out the conf file' do
      @conf_file_response_mock.stub_as_unsuccessful
      @deleter.delete_snapshot('snap_1').should be_an_unsuccessful_response
    end

    it 'should return an unsuccessful response if the snapshot does not exist' do
      @snapshots_response_mock.stub_as_successful []
      response = @deleter.delete_snapshot 'snap_1'
      response.should be_an_unsuccessful_response "Unable to find a snapshot named 'snap_1'."
    end

    it 'should return an unsuccessful response if there was a problem listing the existing snapshots' do
      @snapshots_response_mock.stub_as_unsuccessful
      @deleter.delete_snapshot('snap_1').should be_an_unsuccessful_response
    end

    it 'should return a response when deleting the snapshot' do
      executor_mock = double('executor')
      response      = double
      cmd           = "#{@vmrun_cmd} deleteSnapshot "
      cmd           << "'#{@conf_file_path}' \"snap_1\" 2>&1"

      executor_mock.should_receive(:execute).and_return(executor_mock)
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(cmd).
                                     and_return(executor_mock)
      Fission::Response.should_receive(:from_shell_executor).
                        with(executor_mock).
                        and_return(response)

      @deleter.delete_snapshot('snap_1').should == response
    end

    context 'when the gui is running' do
      before do
        Fission::Fusion.stub(:running?).and_return(true)
      end

      it 'should return an unsuccessful response if the vm is not running' do
        @running_response_mock.stub_as_successful false
        response = @deleter.delete_snapshot 'snap_1'
        error_message = 'A snapshot cannot be deleted when the GUI is running and the VM is not running.'
        response.should be_an_unsuccessful_response error_message
      end

      it 'should return an unsuccessful response if unable to determine if running' do
        @running_response_mock.stub_as_unsuccessful
        @deleter.delete_snapshot('snap_1').should be_an_unsuccessful_response
      end
    end

  end

end
