require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Server do
  let(:server_class) do
    class Fog::Compute::XenServer::Models::Server
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Server
  end

  let(:server) { Fog::Compute::XenServer::Models::Server.new }
  let(:service) { Object.new }
  let(:collection) { Object.new }
  let(:vif) { Fog::Compute::XenServer::Models::Vif.new }
  let(:vbd) { Fog::Compute::XenServer::Models::Vbd.new }

  it 'should associate to a provider class' do
    server_class.provider_class.must_equal('VM')
  end

  it 'should have a collection name' do
    server_class.collection_name.must_equal(:servers)
  end

  it 'should have an unique id' do
    server_class.read_identity.must_equal(:reference)
  end

  it 'should have 57 attributes' do
    server_class.attributes.must_equal([ :reference,
                                         :actions_after_crash,
                                         :actions_after_reboot,
                                         :actions_after_shutdown,
                                         :allowed_operations,
                                         :blobs,
                                         :blocked_operations,
                                         :bios_strings,
                                         :current_operations,
                                         :domarch,
                                         :domid,
                                         :description,
                                         :generation_id,
                                         :ha_always_run,
                                         :ha_restart_priority,
                                         :hvm_boot_params,
                                         :hvm_boot_policy,
                                         :hvm_shadow_multiplier,
                                         :is_a_snapshot,
                                         :is_a_template,
                                         :is_control_domain,
                                         :is_snapshot_from_vmpp,
                                         :last_booted_record,
                                         :last_boot_cpu_flags,
                                         :memory_dynamic_max,
                                         :memory_dynamic_min,
                                         :memory_overhead,
                                         :memory_static_max,
                                         :memory_static_min,
                                         :memory_target,
                                         :name,
                                         :order,
                                         :other_config,
                                         :pci_bus,
                                         :platform,
                                         :power_state,
                                         :pv_args,
                                         :pv_bootloader,
                                         :pv_bootloader_args,
                                         :pv_kernel,
                                         :pv_legacy_args,
                                         :pv_ramdisk,
                                         :recommendations,
                                         :shutdown_delay,
                                         :snapshot_info,
                                         :snapshot_metadata,
                                         :snapshot_time,
                                         :start_delay,
                                         :tags,
                                         :transportable_snapshot_id,
                                         :user_version,
                                         :uuid,
                                         :vcpus_at_startup,
                                         :vcpus_max,
                                         :vcpus_params,
                                         :version,
                                         :xenstore_data ])
  end

  it 'should have 19 associations' do
    server_class.associations.must_equal(:affinity => :hosts,
                                         :appliance => :server_appliances,
                                         :attached_pcis => :pcis,
                                         :children => :servers,
                                         :consoles => :consoles,
                                         :crash_dumps => :crash_dumps,
                                         :guest_metrics => :guests_metrics,
                                         :metrics => :servers_metrics,
                                         :parent => :servers,
                                         :protection_policy => :vmpps,
                                         :resident_on => :hosts,
                                         :snapshots => :servers,
                                         :snapshot_of => :servers,
                                         :suspend_sr => :storage_repositories,
                                         :suspend_vdi => :vdis,
                                         :vbds => :vbds,
                                         :vgpus => :vgpus,
                                         :vifs => :vifs,
                                         :vtpms => :vtpms)
  end

  it 'should have 76 masks' do
    server_class.masks.must_equal(:reference => :reference,
                                  :actions_after_crash => :actions_after_crash,
                                  :actions_after_reboot => :actions_after_reboot,
                                  :actions_after_shutdown => :actions_after_shutdown,
                                  :allowed_operations => :allowed_operations,
                                  :blobs => :blobs,
                                  :blocked_operations => :blocked_operations,
                                  :bios_strings => :bios_strings,
                                  :current_operations => :current_operations,
                                  :domarch => :domarch,
                                  :domid => :domid,
                                  :description => :name_description,
                                  :generation_id => :generation_id,
                                  :ha_always_run => :ha_always_run,
                                  :ha_restart_priority => :ha_restart_priority,
                                  :hvm_boot_params => :HVM_boot_params,
                                  :hvm_boot_policy => :HVM_boot_policy,
                                  :hvm_shadow_multiplier => :HVM_shadow_multiplier,
                                  :is_a_snapshot => :is_a_snapshot,
                                  :is_a_template => :is_a_template,
                                  :is_control_domain => :is_control_domain,
                                  :is_snapshot_from_vmpp => :is_snapshot_from_vmpp,
                                  :last_booted_record => :last_booted_record,
                                  :last_boot_cpu_flags => :last_boot_CPU_flags,
                                  :memory_dynamic_max => :memory_dynamic_max,
                                  :memory_dynamic_min => :memory_dynamic_min,
                                  :memory_overhead => :memory_overhead,
                                  :memory_static_max => :memory_static_max,
                                  :memory_static_min => :memory_static_min,
                                  :memory_target => :memory_target,
                                  :name => :name_label,
                                  :order => :order,
                                  :other_config => :other_config,
                                  :pci_bus => :PCI_bus,
                                  :platform => :platform,
                                  :power_state => :power_state,
                                  :pv_args => :PV_args,
                                  :pv_bootloader => :PV_bootloader,
                                  :pv_bootloader_args => :PV_bootloader_args,
                                  :pv_kernel => :PV_kernel,
                                  :pv_legacy_args => :PV_legacy_args,
                                  :pv_ramdisk => :PV_ramdisk,
                                  :recommendations => :recommendations,
                                  :shutdown_delay => :shutdown_delay,
                                  :snapshot_info => :snapshot_info,
                                  :snapshot_metadata => :snapshot_metadata,
                                  :snapshot_time => :snapshot_time,
                                  :start_delay => :start_delay,
                                  :tags => :tags,
                                  :transportable_snapshot_id => :transportable_snapshot_id,
                                  :user_version => :user_version,
                                  :uuid => :uuid,
                                  :vcpus_at_startup => :VCPUs_at_startup,
                                  :vcpus_max => :VCPUs_max,
                                  :vcpus_params => :VCPUs_params,
                                  :version => :version,
                                  :xenstore_data => :xenstore_data,
                                  :affinity => :affinity,
                                  :appliance => :appliance,
                                  :attached_pcis => :attached_PCIs,
                                  :children => :children,
                                  :consoles => :consoles,
                                  :crash_dumps => :crash_dumps,
                                  :guest_metrics => :guest_metrics,
                                  :metrics => :metrics,
                                  :parent => :parent,
                                  :protection_policy => :protection_policy,
                                  :resident_on => :resident_on,
                                  :snapshots => :snapshots,
                                  :snapshot_of => :snapshot_of,
                                  :suspend_sr => :suspend_SR,
                                  :suspend_vdi => :suspend_VDI,
                                  :vbds => :VBDs,
                                  :vgpus => :VGPUs,
                                  :vifs => :VIFs,
                                  :vtpms => :VTPMs)
  end

  it 'should have 23 aliases' do
    server_class.aliases.must_equal(:attached_PCIs => :attached_pcis,
                                    :name_label => :name,
                                    :name_description => :description,
                                    :last_boot_CPU_flags => :last_boot_cpu_flags,
                                    :PV_args => :pv_args,
                                    :PV_bootloader => :pv_bootloader,
                                    :PV_bootloader_args => :pv_bootloader_args,
                                    :PV_kernel => :pv_kernel,
                                    :PV_ramdisk => :pv_ramdisk,
                                    :PV_legacy_args => :pv_legacy_args,
                                    :suspend_SR => :suspend_sr,
                                    :suspend_VDI => :suspend_vdi,
                                    :VBDs => :vbds,
                                    :VCPUs_at_startup => :vcpus_at_startup,
                                    :VCPUs_max => :vcpus_max,
                                    :VCPUs_params => :vcpus_params,
                                    :VGPUs => :vgpus,
                                    :VIFs => :vifs,
                                    :VTPMs => :vtpms,
                                    :HVM_boot_policy => :hvm_boot_policy,
                                    :HVM_boot_params => :hvm_boot_params,
                                    :HVM_shadow_multiplier => :hvm_shadow_multiplier,
                                    :PCI_bus => :pci_bus)
  end

  it 'should have 26 default values' do
    server_class.default_values.must_equal(:actions_after_crash => 'Restart',
                                           :actions_after_reboot => 'Restart',
                                           :actions_after_shutdown => 'Destroy',
                                           :description => '',
                                           :hvm_boot_params => {},
                                           :hvm_boot_policy => '',
                                           :is_a_template => true,
                                           :memory_dynamic_max => '536870912',
                                           :memory_dynamic_min => '536870912',
                                           :memory_static_max => '536870912',
                                           :memory_static_min => '536870912',
                                           :name => '',
                                           :other_config => {},
                                           :pci_bus => '',
                                           :platform => { 'nx' => 'true',
                                                          'acpi' => 'true',
                                                          'apic' => 'true',
                                                          'pae' => 'true',
                                                          'viridian' => 'true' },
                                           :pv_args => '-- quiet console=hvc0',
                                           :pv_bootloader => 'pygrub',
                                           :pv_bootloader_args => '',
                                           :pv_kernel => '',
                                           :pv_legacy_args => '',
                                           :pv_ramdisk => '',
                                           :recommendations => '',
                                           :user_version => '0',
                                           :vcpus_at_startup => '1',
                                           :vcpus_max => '1',
                                           :vcpus_params => {})
  end

  it 'should require 2 attributes before save' do
    server_class.require_before_save.must_equal([ :name, :affinity ])
  end

  describe '#tools_installed?' do
    describe 'when guest_metrics is nil' do
      it 'should return false' do
        server.stub(:guest_metrics, nil) do
          server.tools_installed?.must_equal false
        end
      end
    end

    describe 'when guest_metrics is not nil' do
      it 'should return true' do
        server.stub(:guest_metrics, Object.new) do
          server.tools_installed?.must_equal true
        end
      end
    end
  end

  describe '#home_hypervisor' do
    before :each do
      def service.hosts
        [ 1, 2 ]
      end
    end

    it 'should return the first host' do
      server.stub(:service, service) do
        server.home_hypervisor.must_equal 1
      end
    end
  end

  describe '#mac_address' do
    it 'should return the mac address of the first virtual interface' do
      server.stub(:vifs, [ vif ]) do
        vif.stub(:mac, 'mac') do
          server.mac_address.must_equal 'mac'
        end
      end
    end
  end

  describe '#running?' do
    describe 'when it is running' do
      before :each do
        server.power_state = 'Running'
      end

      it 'should return true' do
        server.stub(:reload, true) do
          server.running?.must_equal true
        end
      end
    end

    describe 'when it is not running' do
      before :each do
        server.power_state = 'Anything'
      end

      it 'should return false' do
        server.stub(:reload, true) do
          server.running?.must_equal false
        end
      end
    end
  end

  describe '#halted?' do
    describe 'when it is halted' do
      before :each do
        server.power_state = 'Halted'
      end

      it 'should return true' do
        server.stub(:reload, true) do
          server.halted?.must_equal true
        end
      end
    end

    describe 'when it is not halted' do
      before :each do
        server.power_state = 'Anything'
      end

      it 'should return false' do
        server.stub(:reload, true) do
          server.halted?.must_equal false
        end
      end
    end
  end

  describe '#destroy' do
    before :each do
      def server.hard_shutdown; @shutdown = true; end
      def vbd.destroy; @destroyed = true; end
      def service.destroy_record(_reference, _provider_class); @destroyed = true; end
      server.stub(:service, service) do
        server.stub(:vbds, [vbd]) do
          server.destroy
        end
      end
    end

    it 'should shutdown the vm' do
      server.instance_variable_get(:@shutdown).must_equal(true)
    end

    it 'should destroy the vbds' do
      vbd.instance_variable_get(:@destroyed).must_equal(true)
    end

    it 'should destroy the vm' do
      service.instance_variable_get(:@destroyed).must_equal(true)
    end
  end

  describe '#start' do
    describe 'on a running server' do
      before :each do
        def server.running?; true end
      end

      it 'should return false' do
        server.start.must_equal(false)
      end
    end

    describe 'on a halted server' do
      before :each do
        def server.running?; false end
        def service.start_vm(reference); @started = true end
        def server.wait_for(&block); instance_eval(&block); @started = true end
        server.stub(:service, service) do
          server.start
        end
      end

      it 'should start the server' do
        service.instance_variable_get(:@started).must_equal(true)
      end

      it 'should wait the server start' do
        server.instance_variable_get(:@started).must_equal(true)
      end

      it 'should return true' do
        server.stub(:service, service) do
          server.start.must_equal(true)
        end
      end
    end
  end

  describe '#hard_shutdown' do
    describe 'on a halted server' do
      before :each do
        def server.halted?; true end
      end

      it 'should return false' do
        server.hard_shutdown.must_equal(false)
      end
    end

    describe 'on a running server' do
      before :each do
        def server.halted?; false end
        def service.hard_shutdown_vm(reference); @halted = true end
        def server.wait_for(&block); instance_eval(&block); @halted = true end
        server.stub(:service, service) do
          server.hard_shutdown
        end
      end

      it 'should shutdown the server' do
        service.instance_variable_get(:@halted).must_equal(true)
      end

      it 'should wait the server shutdown' do
        server.instance_variable_get(:@halted).must_equal(true)
      end

      it 'should return true' do
        server.stub(:service, service) do
          server.hard_shutdown.must_equal(true)
        end
      end
    end
  end

  describe '#clean_shutdown' do
    describe 'on a halted server' do
      before :each do
        def server.halted?; true end
      end

      it 'should return false' do
        server.clean_shutdown.must_equal(false)
      end
    end

    describe 'on a running server' do
      before :each do
        def server.halted?; false end
        def service.clean_shutdown_vm(reference); @halted = true end
        def server.wait_for(&block); instance_eval(&block); @halted = true end
        server.stub(:service, service) do
          server.clean_shutdown
        end
      end

      it 'should shutdown the server' do
        service.instance_variable_get(:@halted).must_equal(true)
      end

      it 'should wait the server shutdown' do
        server.instance_variable_get(:@halted).must_equal(true)
      end

      it 'should return true' do
        server.stub(:service, service) do
          server.clean_shutdown.must_equal(true)
        end
      end
    end
  end

  describe '#can_be_cloned?' do
    describe "when it can be cloned" do
      before :each do
        server.allowed_operations = %w(clone)
      end

      it 'should return true' do
        server.can_be_cloned?.must_equal(true)
      end
    end

    describe 'when can not be cloned' do
      before :each do
        server.allowed_operations = []
      end

      it 'should return false' do
        server.can_be_cloned?.must_equal(false)
      end
    end
  end

  describe '#clone' do
    describe "when it can be cloned" do
      before :each do
        def server.can_be_cloned?; true end
        def service.clone_vm(_reference, _name); @cloned = true end
        def server.reload; @reloaded = true end
        server.stub(:service, service) do
          server.clone('')
        end
      end

      it 'should clone the vm' do
        service.instance_variable_get(:@cloned).must_equal(true)
      end

      it 'should reload the vm' do
        server.instance_variable_get(:@reloaded).must_equal(true)
      end
    end

    describe 'when can not be cloned' do
      before :each do
        def server.can_be_cloned?; false end
      end

      it 'should raise an exception' do
        lambda { server.clone('') }.must_raise RuntimeError, 'Clone Operation not Allowed'
      end
    end
  end

  describe '#revert' do
    before :each do
      collection.instance_variable_set(:@server, server)
      def collection.get_by_reference_or_name_or_uuid(name); @server end
      def service.revert_vm(reference); @reverted = true end
      server.stub(:service, service) do
        server.stub(:collection, collection) do
          server.revert('snapshot')
        end
      end
    end

    it 'should revert the snapshot' do
      service.instance_variable_get(:@reverted).must_equal(true)
    end
  end
end
