require 'spec_helper'

describe Fission::Action::VM::Deleter do

  describe 'delete' do
    before do
      @vm                      = Fission::VM.new 'foo'
      @vmrun_cmd               = Fission.config['vmrun_cmd']
      @conf_file_path          = File.join @vm.path, 'foo.vmx'
      @conf_file_response_mock = double('conf_file_response')
      @running_response_mock   = double('running?')
      @vm_files                = %w{ .vmx .vmxf .vmdk -s001.vmdk -s002.vmdk .vmsd }

      @vm.stub(:exists?).and_return(true)
      @vm.stub(:running?).and_return(@running_response_mock)
      @vm.stub(:conf_file).and_return(@conf_file_response_mock)
      @running_response_mock.stub_as_successful false
      @conf_file_response_mock.stub_as_successful @conf_file_path
      @deleter = Fission::Action::VM::Deleter.new @vm

      FakeFS.activate!

      FileUtils.mkdir_p @vm.path

      @vm_files.each do |file|
        FileUtils.touch File.join(@vm.path, "#{@vm.name}#{file}")
      end
    end

    after do
      FakeFS.deactivate!
    end

    it "should return an unsuccessful response if the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)

      response = @deleter.delete
      response.should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if the vm is running' do
      @running_response_mock.stub_as_successful true

      response = @deleter.delete
      response.should be_an_unsuccessful_response 'The VM must not be running in order to delete it.'
    end

    it 'should return an unsuccessful response if unable to determine if running' do
      @running_response_mock.stub_as_unsuccessful

      response = @deleter.delete
      response.should be_an_unsuccessful_response
    end

    it "should delete the target vm files" do
      Fission::Metadata.stub(:delete_vm_info)

      @deleter.delete

      @vm_files.each do |file|
        file_path = File.join @vm.path, "#{@vm.name}#{file}"
        File.exists?(file_path).should == false
      end

      File.directory?(@vm.path).should == false
    end

    it 'should delete the target vm metadata' do
      Fission::Metadata.should_receive(:delete_vm_info).with(@vm.path)
      @deleter.delete
    end

    it 'should return a successful reponse object' do
      Fission::Metadata.stub(:delete_vm_info)
      @deleter.delete.should be_a_successful_response
    end

  end
end
