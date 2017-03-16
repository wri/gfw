require 'spec_helper'

describe Fission::Action::VM::Cloner do

  describe 'clone' do
    before do
      @source_vm   = Fission::VM.new 'foo'
      @target_vm   = Fission::VM.new 'bar'
      @source_path = @source_vm.path
      @target_path = @target_vm.path

      @clone_response_mock = double('clone_response')
      @vm_files = ['.vmx', '.vmxf', '.vmdk', '-s001.vmdk', '-s002.vmdk', '.vmsd']

      FakeFS.activate!

      FileUtils.mkdir_p @source_path

      @vm_files.each do |file|
        FileUtils.touch "#{@source_path}/#{@source_vm.name}#{file}"
      end

      ['.vmx', '.vmxf', '.vmdk'].each do |ext|
        File.open("#{@source_path}/foo#{ext}", 'w') { |f| f.write 'foo.vmdk'}
      end

      @source_vm.stub(:exists?).and_return(true)
      @target_vm.stub(:exists?).and_return(false)

      Fission::VM.stub(:new).with(@source_vm.name).
                             and_return(@source_vm)
      Fission::VM.stub(:new).with(@target_vm.name).
                             and_return(@target_vm)

      vmx_content = 'ide1:0.deviceType = "cdrom-image"
nvram = "foo.nvram"
ethernet0.present = "TRUE"
ethernet1.address = "00:0c:29:1d:6a:75"
ethernet0.connectionType = "nat"
ethernet0.generatedAddress = "00:0c:29:1d:6a:64"
ethernet0.virtualDev = "e1000"
tools.remindInstall = "TRUE"
ethernet0.wakeOnPcktRcv = "FALSE"
ethernet0.addressType = "generated"
uuid.action = "keep"
ethernet0.linkStatePropagation.enable = "TRUE"
ethernet0.generatedAddressenable = "TRUE"
ethernet1.generatedAddressenable = "TRUE"'

      File.open("#{@source_path}/#{@source_vm.name}.vmx", 'w') do |f|
        f.write vmx_content
      end

      ['.vmx', '.vmxf'].each do |ext|
        File.stub(:binary?).
             with("#{@target_path}/#{@target_vm.name}#{ext}").
             and_return(false)
      end

      File.stub(:binary?).
           with("#{@target_path}/#{@target_vm.name}.vmdk").
           and_return(true)
      @cloner = Fission::Action::VM::Cloner.new @source_vm, @target_vm
    end

    after do
      FakeFS.deactivate!
      FakeFS::FileSystem.clear
    end

    it "should return an unsuccessful response if the source vm doesn't exist" do
      @source_vm.stub(:exists?).and_return(false)
      response = @cloner.clone
      response.should be_an_unsuccessful_response 'VM does not exist'
    end

    it "should return an unsuccessful response if the target vm exists" do
      @target_vm.stub(:exists?).and_return(true)
      response = @cloner.clone
      response.should be_an_unsuccessful_response 'VM already exists'
    end

    it 'should copy the vm files to the target' do
      @cloner.clone

      File.directory?(@target_path).should == true

      @vm_files.each do |file|
        File.file?("#{@target_path}/bar#{file}").should == true
      end
    end

    it "should copy the vm files to the target if a file name doesn't match the directory" do
      FileUtils.touch "#{@source_path}/other_name.nvram"

      @cloner.clone

      File.directory?(@target_path).should == true

      @vm_files.each do |file|
        File.file?("#{@target_path}/#{@target_vm.name}#{file}").should == true
      end

      File.file?("#{@target_path}/bar.nvram").should == true
    end

    it "should copy the vm files to the target if a sparse disk file name doesn't match the directory" do
      FileUtils.touch "#{@source_path}/other_name-s003.vmdk"

      @cloner.clone

      File.directory?(@target_path).should == true

      @vm_files.each do |file|
        File.file?("#{@target_path}/#{@target_vm.name}#{file}").should == true
      end

      File.file?("#{@target_path}/bar-s003.vmdk").should == true
    end

    it 'should update the target vm config files' do
      @cloner.clone

      ['.vmx', '.vmxf'].each do |ext|
        File.read("#{@target_path}/bar#{ext}").should_not match /foo/
        File.read("#{@target_path}/bar#{ext}").should match /bar/
      end
    end

    it 'should disable VMware tools warning in the conf file' do
      @cloner.clone
      pattern = /^tools\.remindInstall = "FALSE"/
      File.read("#{@target_path}/bar.vmx").should match pattern
    end

    it 'should remove auto generated MAC addresses from the conf file' do
      @cloner.clone
      pattern = /^ethernet\.+generatedAddress.+/
      File.read("#{@target_path}/bar.vmx").should_not match pattern
    end

    it 'should setup the conf file to generate a new uuid' do
      @cloner.clone
      pattern = /^uuid\.action = "create"/
      File.read("#{@target_path}/bar.vmx").scan(pattern).count.should == 1
    end

    context 'when uuid.action already exists in the source conf file' do
      before do
        File.open("#{@source_path}/#{@source_vm.name}.vmx", 'a') do |f|
          f.write "\nuuid.action = \"create\""
        end
      end

      it 'should not add another entry for uuid.action' do
        @cloner.clone
        pattern = /^uuid\.action = "create"/
        File.read("#{@target_path}/bar.vmx").scan(pattern).count.should == 1
      end
    end

    context 'when tools.remindInstall already exists in the source conf file' do
      before do
        File.open("#{@source_path}/#{@source_vm.name}.vmx", 'w') do |f|
          f.write "\ntools.remindInstall = \"FALSE\""
        end
      end

      it 'should not add another entry for tools.remindInstall' do
        @cloner.clone
        pattern = /^tools\.remindInstall = "FALSE"/
        File.read("#{@target_path}/bar.vmx").scan(pattern).count.should == 1
      end
    end

    it "should not try to update the vmdk file if it's not a sparse disk" do
      @cloner.clone
      File.read("#{@target_path}/bar.vmdk").should match /foo/
    end

    it 'should return a successful response if clone was successful' do
      @cloner.clone.should be_a_successful_response
    end

    context 'when a sparse disk is found' do
      it "should update the vmdk" do
        File.stub(:binary?).and_return(false)

        @cloner.clone

        File.read("#{@target_path}/bar.vmdk").should match /bar/
      end
    end

  end

end
