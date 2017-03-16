require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Host do
  let(:host_class) do
    class Fog::Compute::XenServer::Models::Host
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Host
  end
  let(:host) { Fog::Compute::XenServer::Models::Host.new }
  let(:service) { Object.new }

  it 'should associate to a provider class' do
    host_class.provider_class.must_equal('host')
  end

  it 'should have a collection name' do
    host_class.collection_name.must_equal(:hosts)
  end

  it 'should have an unique id' do
    host_class.read_identity.must_equal(:reference)
  end

  it 'should have 39 attributes' do
    host_class.attributes.must_equal([ :reference,
                                       :address,
                                       :allowed_operations,
                                       :api_version_major,
                                       :api_version_minor,
                                       :api_version_vendor,
                                       :api_version_vendor_implementation,
                                       :bios_strings,
                                       :blobs,
                                       :capabilities,
                                       :chipset_info,
                                       :cpu_configuration,
                                       :cpu_info,
                                       :current_operations,
                                       :description,
                                       :edition,
                                       :enabled,
                                       :external_auth_configuration,
                                       :external_auth_service_name,
                                       :external_auth_type,
                                       :guest_vcpus_params,
                                       :ha_network_peers,
                                       :ha_statefiles,
                                       :hostname,
                                       :license_params,
                                       :license_server,
                                       :logging,
                                       :memory_overhead,
                                       :name,
                                       :other_config,
                                       :patches,
                                       :power_on_config,
                                       :power_on_mode,
                                       :sched_policy,
                                       :software_version,
                                       :supported_bootloaders,
                                       :suspend_image_sr,
                                       :tags,
                                       :uuid ])
  end

  it 'should have 10 associations' do
    host_class.associations.must_equal(:crashdumps => :crash_dumps, 
                                       :crash_dump_sr => :storage_repositories, 
                                       :host_cpus => :host_cpus, 
                                       :local_cache_sr => :storage_repositories, 
                                       :metrics => :hosts_metrics, 
                                       :pbds => :pbds, 
                                       :pcis => :pcis, 
                                       :pgpus => :pgpus, 
                                       :pifs => :pifs, 
                                       :resident_vms => :servers)
  end

  it 'should have 49 masks' do
    host_class.masks.must_equal(:reference => :reference,
                                :address => :address,
                                :allowed_operations => :allowed_operations,
                                :api_version_major => :API_version_major,
                                :api_version_minor => :API_version_minor,
                                :api_version_vendor => :API_version_vendor,
                                :api_version_vendor_implementation => :API_version_vendor_implementation,
                                :bios_strings => :bios_strings,
                                :blobs => :blobs,
                                :capabilities => :capabilities,
                                :chipset_info => :chipset_info,
                                :cpu_configuration => :cpu_configuration,
                                :cpu_info => :cpu_info,
                                :current_operations => :current_operations,
                                :description => :description,
                                :edition => :edition,
                                :enabled => :enabled,
                                :external_auth_configuration => :external_auth_configuration,
                                :external_auth_service_name => :external_auth_service_name,
                                :external_auth_type => :external_auth_type,
                                :guest_vcpus_params => :guest_VCPUs_params,
                                :ha_network_peers => :ha_network_peers,
                                :ha_statefiles => :ha_statefiles,
                                :hostname => :hostname,
                                :license_params => :license_params,
                                :license_server => :license_server,
                                :logging => :logging,
                                :memory_overhead => :memory_overhead,
                                :name => :name,
                                :other_config => :other_config,
                                :patches => :patches,
                                :power_on_config => :power_on_config,
                                :power_on_mode => :power_on_mode,
                                :sched_policy => :sched_policy,
                                :software_version => :software_version,
                                :supported_bootloaders => :supported_bootloaders,
                                :suspend_image_sr => :suspend_image_sr,
                                :tags => :tags,
                                :uuid => :uuid,
                                :crashdumps => :crashdumps,
                                :crash_dump_sr => :crash_dump_sr,
                                :host_cpus => :host_CPUs,
                                :local_cache_sr => :local_cache_sr,
                                :metrics => :metrics,
                                :pbds => :PBDs,
                                :pcis => :PCIs,
                                :pgpus => :PGPUs,
                                :pifs => :PIFs,
                                :resident_vms => :resident_VMs)
  end

  it 'should have 13 aliases' do
    host_class.aliases.must_equal(:name_label => :name,
                                  :API_version_major => :api_version_major,
                                  :API_version_minor => :api_version_minor,
                                  :API_version_vendor => :api_version_vendor,
                                  :API_version_vendor_implementation => :api_version_vendor_implementation,
                                  :guest_VCPUs_params => :guest_vcpus_params,
                                  :name_description => :description,
                                  :host_CPUs => :host_cpus,
                                  :PBDs => :pbds,
                                  :PCIs => :pcis,
                                  :PGPUs => :pgpus,
                                  :PIFs => :pifs,
                                  :resident_VMs => :resident_vms)
  end

  it "shouldn't have default values" do
    host_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    host_class.require_before_save.must_equal([])
  end

  describe '#shutdown' do
    describe 'with auto_disable equal true' do
      before :each do
        def service.disable_host(reference); @disabled = true end
        def service.shutdown_host(reference); @halted = true end
        host.stub(:service, service) do
          host.shutdown
        end
      end

      it 'should disable the host' do
        service.instance_variable_get(:@disabled).must_equal(true)
      end

      it 'should shutdown the host' do
        service.instance_variable_get(:@halted).must_equal(true)
      end
    end

    describe 'with auto_disable equal false' do
      before :each do
        def service.shutdown_host(reference); @halted = true end
        host.stub(:service, service) do
          host.shutdown(false)
        end
      end

      it 'should not disable the host' do
        service.instance_variable_get(:@disabled).must_equal(nil)
      end

      it 'should shutdown the host' do
        service.instance_variable_get(:@halted).must_equal(true)
      end
    end
  end

  describe '#reboot' do
    describe 'with auto_disable equal true' do
      before :each do
        def service.disable_host(reference); @disabled = true end
        def service.reboot_host(reference); @rebooted = true end
        host.stub(:service, service) do
          host.reboot
        end
      end

      it 'should disable the host' do
        service.instance_variable_get(:@disabled).must_equal(true)
      end

      it 'should shutdown the host' do
        service.instance_variable_get(:@rebooted).must_equal(true)
      end
    end

    describe 'with auto_disable equal false' do
      before :each do
        def service.reboot_host(reference); @rebooted = true end
        host.stub(:service, service) do
          host.reboot(false)
        end
      end

      it 'should not disable the host' do
        service.instance_variable_get(:@disabled).must_equal(nil)
      end

      it 'should shutdown the host' do
        service.instance_variable_get(:@rebooted).must_equal(true)
      end
    end
  end
end