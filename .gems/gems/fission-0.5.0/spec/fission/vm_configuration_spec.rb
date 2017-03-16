require 'spec_helper'

describe Fission::VMConfiguration do
  before do
    @vm = Fission::VM.new 'foo'
    @conf_file_response_mock = double('conf_file_response')
    @conf_file_response_mock.stub_as_successful @conf_file_path
  end

  describe 'config_data' do
    before do
      @vm.stub(:exists?).and_return(true)
      @vm_config = Fission::VMConfiguration.new @vm
      @vm.stub(:conf_file).and_return(@conf_file_response_mock)
    end

    it "should return an unsuccessful response if the vm doesn't exist" do
      @vm.stub(:exists?).and_return(false)
      @vm_config.config_data.should be_an_unsuccessful_response 'VM does not exist'
    end

    it 'should return an unsuccessful response if unable to figure out the conf file' do
      @conf_file_response_mock.stub_as_unsuccessful
      @vm_config.config_data.should be_an_unsuccessful_response
    end

    context 'when the vm exists and the conf file can be found' do
      before do
        @conf_file_io = StringIO.new
        vmx_content = '.encoding = "UTF-8"
config.version = "8"
virtualHW.version = "7"
scsi0.present = "TRUE"
scsi0.virtualDev = "lsilogic"
memsize = "384"
scsi0:0.present = "TRUE"
scsi0:0.fileName = "u10_04-000001.vmdk"
ethernet0.present = "TRUE"
ethernet0.connectionType = "nat"
ethernet0.wakeOnPcktRcv = "FALSE"
ethernet0.addressType = "generated"
ethernet0.linkStatePropagation.enable = "TRUE"
ehci.present = "TRUE"
pciBridge4.virtualDev = "pcieRootPort"
pciBridge4.functions = "8"
vmci0.present = "TRUE"
roamingVM.exitBehavior = "go"
tools.syncTime = "TRUE"
displayName = "u10_04"
guestOS = "ubuntu"
nvram = "u10_04.nvram"
virtualHW.productCompatibility = "hosted"
tools.upgrade.policy = "upgradeAtPowerCycle"
extendedConfigFile = "u10_04.vmxf"
serial0.present = "FALSE"
usb.present = "FALSE"
checkpoint.vmState = "u10_04.vmss"
ethernet0.generatedAddress = "00:0c:29:c4:94:22"
uuid.location = "56 4d 4b e9 1a bb 22 3a-b0 91 06 4e b4 c4 94 22"
uuid.bios = "56 4d 4b e9 1a bb 22 3a-b0 91 06 4e b4 c4 94 22"
cleanShutdown = "TRUE"
scsi0:0.redo = ""
scsi0.pciSlotNumber = "16"
ethernet0.pciSlotNumber = "32"
ethernet0.generatedAddressOffset = "0"
vmci0.id = "-1262185438"
tools.remindInstall = "TRUE"'
        @conf_file_io.string = vmx_content
        File.should_receive(:readlines).with(@conf_file_path).
                                         and_return(@conf_file_io.string.split(/$/))
      end

      it 'should return a successful response' do
        @vm_config.config_data.should be_a_successful_response
      end

      it 'should return the data as a hash like object' do
        config = @vm_config.config_data
        config.data.should respond_to :keys
        config.data.should respond_to :values
        config.data.should respond_to :each_pair
        config.data.should respond_to :[]
      end

      it 'should return accurate data' do
        expected_data = { '.encoding' => 'UTF-8',
                          'config.version' => '8',
                          'virtualHW.version' => '7',
                          'scsi0.present' => 'TRUE',
                          'scsi0.virtualDev' => 'lsilogic',
                          'memsize' => '384',
                          'scsi0:0.present' => 'TRUE',
                          'scsi0:0.fileName' => 'u10_04-000001.vmdk',
                          'ethernet0.present' => 'TRUE',
                          'ethernet0.connectionType' => 'nat',
                          'ethernet0.wakeOnPcktRcv' => 'FALSE',
                          'ethernet0.addressType' => 'generated',
                          'ethernet0.linkStatePropagation.enable' => 'TRUE',
                          'ehci.present' => 'TRUE',
                          'pciBridge4.virtualDev' => 'pcieRootPort',
                          'pciBridge4.functions' => '8',
                          'vmci0.present' => 'TRUE',
                          'roamingVM.exitBehavior' => 'go',
                          'tools.syncTime' => 'TRUE',
                          'displayName' => 'u10_04',
                          'guestOS' => 'ubuntu',
                          'nvram' => 'u10_04.nvram',
                          'virtualHW.productCompatibility' => 'hosted',
                          'tools.upgrade.policy' => 'upgradeAtPowerCycle',
                          'extendedConfigFile' => 'u10_04.vmxf',
                          'serial0.present' => 'FALSE',
                          'usb.present' => 'FALSE',
                          'checkpoint.vmState' => 'u10_04.vmss',
                          'ethernet0.generatedAddress' => '00:0c:29:c4:94:22',
                          'uuid.location' => '56 4d 4b e9 1a bb 22 3a-b0 91 06 4e b4 c4 94 22',
                          'uuid.bios' => '56 4d 4b e9 1a bb 22 3a-b0 91 06 4e b4 c4 94 22',
                          'cleanShutdown' => 'TRUE',
                          'scsi0:0.redo' => '',
                          'scsi0.pciSlotNumber' => '16',
                          'ethernet0.pciSlotNumber' => '32',
                          'ethernet0.generatedAddressOffset' => '0',
                          'vmci0.id' => '-1262185438',
                          'tools.remindInstall' => 'TRUE' }

        config = @vm_config.config_data
        config.data.should == expected_data
      end

    end
  end

end
