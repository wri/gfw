require 'spec_helper'

describe Fission::Action::Snapshot::Lister do
  before do
    @vm                      = Fission::VM.new 'foo'
    @conf_file_path          = File.join @vm.path, 'foo.vmx'
    @vmrun_cmd               = Fission.config['vmrun_cmd']
    @conf_file_response_mock = double('conf_file_response')
    @vm.stub(:conf_file).and_return(@conf_file_response_mock)
  end

  describe 'snapshots' do
    before do
      @vm.stub(:exists?).and_return(true)
      @conf_file_response_mock.stub_as_successful @conf_file_path
      @lister = Fission::Action::Snapshot::Lister.new @vm
    end

    it "should return an unsuccessful repsonse when the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)
      @lister.snapshots.should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if unable to figure out the conf file' do
      @conf_file_response_mock.stub_as_unsuccessful
      @lister.snapshots.should be_an_unsuccessful_response
    end

    it 'should return a response when listing the snapshots' do
      executor_mock = double('executor')
      process_mock  = double(:exitstatus => 0)
      cmd           = "#{@vmrun_cmd} listSnapshots "
      cmd           << "'#{@conf_file_path}' 2>&1"

      output_text = "Total snapshots: 3\nsnap foo\nsnap bar\nsnap baz\n"
      executor_mock.should_receive(:execute).
                    and_return({'output'         => output_text,
                                'process_status' => process_mock})

      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(cmd).
                                     and_return(executor_mock)

      response = @lister.snapshots
      response.should be_a_successful_response
      response.data.should == ['snap foo', 'snap bar', 'snap baz']
    end

    it 'should return an unsuccessful response if there was a problem listing the snapshots' do
      executor_mock = double('executor')
      process_mock  = double(:exitstatus => 1)
      cmd           = "#{@vmrun_cmd} listSnapshots "
      cmd           << "'#{@conf_file_path}' 2>&1"

      executor_mock.should_receive(:execute).
                    and_return({'output'         => 'it blew up',
                                'process_status' => process_mock})

      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(cmd).
                                     and_return(executor_mock)

      @lister.snapshots.should be_an_unsuccessful_response
    end
  end

end
