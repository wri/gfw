require 'spec_helper'

describe Fission::Action::VM::Starter do

  describe 'start' do
    before do
      @vm                      = Fission::VM.new 'foo'
      @vmrun_cmd               = Fission.config['vmrun_cmd']
      @conf_file_path          = File.join @vm.path, 'foo.vmx'
      @conf_file_response_mock = double('conf_file_response')
      @running_response_mock   = double('running?')

      @vm.stub(:exists?).and_return(true)
      @vm.stub(:running?).and_return(@running_response_mock)
      @vm.stub(:conf_file).and_return(@conf_file_response_mock)
      @running_response_mock.stub_as_successful false
      @conf_file_response_mock.stub_as_successful @conf_file_path
      @starter = Fission::Action::VM::Starter.new @vm
    end

    it "should return an unsuccessful response if the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)
      @starter.start.should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if the vm is already running' do
      @running_response_mock.stub_as_successful true
      @starter.start.should be_an_unsuccessful_response 'VM is already running'
    end

    it 'should return an unsuccessful response if unable to determine if running' do
      @running_response_mock.stub_as_unsuccessful
      @starter.start.should be_an_unsuccessful_response
    end

    it 'should return an unsuccessful response if unable to figure out the conf file' do
      @conf_file_response_mock.stub_as_unsuccessful
      @starter.start.should be_an_unsuccessful_response
    end

    context 'when the fusion gui is not running' do
      before do
        @executor_mock = double('executor')
        @response      = double
        @executor_mock.should_receive(:execute).and_return(@executor_mock)
        Fission::Fusion.stub(:running?).and_return(false)
        Fission::Response.should_receive(:from_shell_executor).
                          with(@executor_mock).
                          and_return(@response)
      end

      it 'should return a response when starting the vm' do
        cmd = "#{@vmrun_cmd} start '#{@conf_file_path}' gui 2>&1"
        Fission::Action::ShellExecutor.should_receive(:new).
                                       with(cmd).
                                       and_return(@executor_mock)
        @starter.start.should == @response
      end

      it 'should return a response when starting the vm headless' do
        cmd = "#{@vmrun_cmd} start '#{@conf_file_path}' nogui 2>&1"
        Fission::Action::ShellExecutor.should_receive(:new).
                                       with(cmd).
                                       and_return(@executor_mock)
        @starter.start(:headless => true).should == @response
      end

    end

    context 'when the fusion gui is running' do
      before do
        Fission::Fusion.stub(:running?).and_return(true)
      end

      it 'should return an unsuccessful response if starting headless' do
        response = @starter.start :headless => true

        error_string = 'It looks like the Fusion GUI is currently running.  '
        error_string << 'A VM cannot be started in headless mode when the Fusion GUI is running.  '
        error_string << 'Exit the Fusion GUI and try again.'

        response.should be_an_unsuccessful_response error_string
      end
    end

  end

end
