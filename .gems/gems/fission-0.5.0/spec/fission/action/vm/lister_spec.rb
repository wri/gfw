require 'spec_helper'

describe Fission::Action::VM::Lister do
  before do
    @vm_1   = Fission::VM.new 'foo'
    @vm_2   = Fission::VM.new 'bar'
    @vm_3   = Fission::VM.new 'baz'
    @lister = Fission::Action::VM::Lister.new
  end

  describe 'all' do
    before do
      @vm_1_mock = double('vm_1')
      @vm_2_mock = double('vm_2')
      @vm_root   = Fission.config['vm_dir']
      @vm_dirs   = ['foo.vmwarevm', 'bar.vmwarevm'].map do |d|
        File.join(@vm_root, d)
      end
    end

    it "should return a successful response with the list of VM objects" do
      Dir.should_receive(:[]).and_return(@vm_dirs)
      @vm_dirs.each do |dir|
        File.should_receive(:directory?).with(dir).and_return(true)
      end

      Fission::VM.should_receive(:new).with('foo').and_return(@vm_1_mock)
      Fission::VM.should_receive(:new).with('bar').and_return(@vm_2_mock)

      response = @lister.all
      response.should be_a_successful_response
      response.data.should == [@vm_1_mock, @vm_2_mock]
    end

    it "should not return an item in the list if it isn't a directory" do
      @vm_dirs << File.join(@vm_root, 'baz.vmwarevm')
      Dir.should_receive(:[]).and_return(@vm_dirs)
      @vm_dirs.each do |dir|
        if dir =~ /baz/
          File.should_receive(:directory?).with(dir).and_return(false)
        else
          File.should_receive(:directory?).with(dir).and_return(true)
        end
      end

      Fission::VM.should_receive(:new).with('foo').and_return(@vm_1_mock)
      Fission::VM.should_receive(:new).with('bar').and_return(@vm_2_mock)

      response = @lister.all
      response.should be_a_successful_response
      response.data.should == [@vm_1_mock, @vm_2_mock]
    end

    it "should only query for items with an extension of .vmwarevm" do
      dir_arg = File.join Fission.config['vm_dir'], '*.vmwarevm'
      Dir.should_receive(:[]).with(dir_arg).and_return([])
      @lister.all
    end
  end

  describe 'all running' do
    before do
      @vmrun_cmd         = Fission.config['vmrun_cmd']
      @vm_names_and_objs = { 'foo' => @vm_1, 'bar' => @vm_2, 'baz' => @vm_3 }
      @executor          = double('executor')
      @process_status    = double('process status')
    end

    it 'should return a successful response with the list of running vms' do
      list_output = "Total running VMs: 2\n/vm/foo.vmwarevm/foo.vmx\n"
      list_output << "/vm/bar.vmwarevm/bar.vmx\n/vm/baz.vmwarevm/baz.vmx\n"
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with("#{@vmrun_cmd} list").
                                     and_return(@executor)
      @process_status.should_receive(:exitstatus).and_return(0)
      @executor.should_receive(:execute).
                and_return({'process_status' => @process_status,
                            'output'  => list_output})

      [ 'foo', 'bar', 'baz'].each do |vm|
        File.should_receive(:exists?).with("/vm/#{vm}.vmwarevm/#{vm}.vmx").
                                      and_return(true)

        Fission::VM.should_receive(:new).with(vm).
                                         and_return(@vm_names_and_objs[vm])
      end

      response = @lister.all_running
      response.should be_a_successful_response
      response.data.should == [@vm_1, @vm_2, @vm_3]
    end

    it 'should return a successful response with the VM dir name if it differs from the .vmx file name' do
      vm_dir_file = { 'foo' => 'foo', 'bar' => 'diff', 'baz' => 'baz'}
      list_output = "Total running VMs: 3\n"
      vm_dir_file.each_pair do |dir, file|
        list_output << "/vm/#{dir}.vmwarevm/#{file}.vmx\n"
        File.should_receive(:exists?).with("/vm/#{dir}.vmwarevm/#{file}.vmx").
                                      and_return(true)
        Fission::VM.should_receive(:new).with(dir).
                                         and_return(@vm_names_and_objs[dir])
      end

      Fission::Action::ShellExecutor.should_receive(:new).
                                     with("#{@vmrun_cmd} list").
                                     and_return(@executor)
      @process_status.should_receive(:exitstatus).and_return(0)
      @executor.should_receive(:execute).
                and_return({'process_status' => @process_status,
                            'output'  => list_output})

      response = @lister.all_running
      response.should be_a_successful_response
      response.data.should =~ [@vm_1, @vm_2, @vm_3]
    end

    it 'should return an unsuccessful response if unable to get the list of running vms' do
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with("#{@vmrun_cmd} list").
                                     and_return(@executor)
      @process_status.should_receive(:exitstatus).and_return(1)
      @executor.should_receive(:execute).
                and_return({'process_status' => @process_status,
                            'output'  => 'it blew up'})
      @lister.all_running.should be_an_unsuccessful_response
    end

  end

  describe 'all_with_status' do
    before do
      @all_running_response_mock = double('all_running_mock')
      @all_vms_response_mock     = double('all_vms_mock')

      @all_vms_response_mock.stub_as_successful [@vm_1, @vm_2, @vm_3]
      @all_running_response_mock.stub_as_successful [@vm_1]

      @vm_2.stub(:suspend_file_exists?).and_return('true')
      @lister.stub(:all).and_return(@all_vms_response_mock)
      @lister.stub(:all_running).and_return(@all_running_response_mock)
    end

    it 'should return a sucessful response with the VMs and their status' do
      response = @lister.all_with_status
      response.should be_a_successful_response
      response.data.should == { 'foo' => 'running',
                                'bar' => 'suspended',
                                'baz' => 'not running' }

    end

    it 'should return an unsuccessful response if unable to get all of the VMs' do
      @all_vms_response_mock.stub_as_unsuccessful
      @lister.all_with_status.should be_an_unsuccessful_response
    end

    it 'should return an unsuccessful repsonse if unable to get the running VMs' do
      @all_running_response_mock.stub_as_unsuccessful
      @lister.all_with_status.should be_an_unsuccessful_response
    end

  end

end
