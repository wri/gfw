require 'spec_helper'

describe Fission::Config do
  describe "init" do
    before do
      FakeFS.activate!
    end

    after do
      FakeFS.deactivate!
      FakeFS::FileSystem.clear
    end

    it "should use the fusion default dir for vm_dir" do
      @config = Fission::Config.new
      @config.attributes['vm_dir'].should == File.expand_path('~/Documents/Virtual Machines.localized/')
    end

    it 'should use the fusion default for vmrun_bin' do
      @config = Fission::Config.new
      @config.attributes['vmrun_bin'].should == '/Library/Application Support/VMware Fusion/vmrun'
    end

    it 'should use the fusion default for plist_file' do
      @config = Fission::Config.new
      @config.attributes['plist_file'].should == File.expand_path('~/Library/Preferences/com.vmware.fusion.plist')
    end

    it 'should use the fusion default for the gui bin' do
      @config = Fission::Config.new
      @config.attributes['gui_bin'].should == File.expand_path('/Applications/VMware Fusion.app/Contents/MacOS/vmware')
    end

    it "should use the user specified dir in ~/.fissionrc" do
      home = File.expand_path('~')
      FileUtils.mkdir_p(home)
      File.open("#{home}/.fissionrc", 'w') do |f|
        f.puts YAML.dump({ 'vm_dir' => '/var/tmp/foo' })
      end

      @config = Fission::Config.new
      @config.attributes['vm_dir'].should == '/var/tmp/foo'
    end

    it 'should use the user specified vmrun bin in ~/.fissionrc' do
      home = File.expand_path('~')
      FileUtils.mkdir_p(home)
      File.open("#{home}/.fissionrc", 'w') do |f|
        f.puts YAML.dump({ 'vmrun_bin' => '/var/tmp/vmrun_bin' })
      end

      @config = Fission::Config.new
      @config.attributes['vmrun_bin'].should == '/var/tmp/vmrun_bin'
    end

    it 'should set vmrun_cmd' do
      @config = Fission::Config.new
      @config.attributes['vmrun_cmd'].should == "'/Library/Application Support/VMware Fusion/vmrun' -T fusion"
    end

    it 'should set the vmrun_cmd correctly if there is a user specified vmrun bin' do
      home = File.expand_path('~')
      FileUtils.mkdir_p(home)
      File.open("#{home}/.fissionrc", 'w') do |f|
        f.puts YAML.dump({ 'vmrun_bin' => '/var/tmp/vmrun_bin' })
      end

      @config = Fission::Config.new
      @config.attributes['vmrun_cmd'].should == "'/var/tmp/vmrun_bin' -T fusion"
    end

    it 'should use the fusion default lease file' do
      @config = Fission::Config.new
      @config.attributes['lease_file'].should == '/var/db/vmware/vmnet-dhcpd-vmnet8.leases'
    end

  end

  describe '[]' do
    before do
      @config_items = { 'vmrun_bin' => '/foo/bar/vmrun',
                        'vmrun_cmd' => '/foo/bar/vmrun -T fusion',
                        'plist_file' => '/foo/bar/plist',
                        'gui_bin' => '/foo/bar/gui',
                        'vm_dir' => '/foo/bar/vms'}
      @config = Fission::Config.new
      @config.attributes = @config_items
    end

    it 'should return the value for specifed key' do
      @config_items.each_pair do |k, v|
        @config[k].should == v
      end
    end

  end

end
