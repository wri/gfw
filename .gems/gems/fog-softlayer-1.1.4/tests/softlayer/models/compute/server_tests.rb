#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Compute[:softlayer] | Server model", ["softlayer"]) do
  pending unless Fog.mocking?

  tests("success") do
    vm_opts = {
        :flavor_id => 'm1.small',
        :image_id => '23f7f05f-3657-4330-8772-329ed2e816bc',
        :name => 'test-vm',
        :domain => 'example.com',
        :datacenter => 'dal05',
        :os_code => 'UBUNTU_LATEST',
        :bare_metal => false
    }

    bmc_opts = {
        :flavor_id => 'm1.small',
        :os_code => 'UBUNTU_LATEST',
        :name => 'test-bmc',
        :domain => 'bare-metal-server.com',
        :datacenter => 'dal05',
        :bare_metal => true
    }

    @vm = Fog::Compute[:softlayer].servers.new(vm_opts)
    @bmc = Fog::Compute[:softlayer].servers.new(bmc_opts)

    ## defaults should be as exactly().timespected
    tests("#hourly_billing_flag") do
      returns(true) { @vm.hourly_billing_flag }
    end

    tests("#ephemeral_storage") do
      returns(false) { @vm.ephemeral_storage }
    end

    ## this should just function as an alias
    tests("#dns_name") do
      returns(@vm.dns_name) { @vm.fqdn }
    end

    tests("#name=") do
      @bmc.name = "new-test-bmc"
      returns(true) { @bmc.name == @bmc.attributes[:hostname] and @bmc.name == "new-test-bmc" }
    end

    tests("#ram=") do
      @bmc.ram = [{'hardwareComponentModel' => { 'capacity' => 4}}]
      returns(4096) { @bmc.ram }
    end

    ## the bare_metal? method should tell the truth
    tests("#bare_metal?") do
      returns(false) { @vm.bare_metal? }
      returns(true) { @bmc.bare_metal? }
    end

    tests("#generate_order_template") do
      data_matches_schema(Hash) { @vm.generate_order_template }
      data_matches_schema(Hash) { @bmc.generate_order_template }
    end

    tests("#save") do
      returns(true) { @vm.save }
      returns(true) { @bmc.save }
    end

    tests("#get_upgrade_options") do
      data_matches_schema(Array) { @vm.get_upgrade_options }
      data_matches_schema(Array) { @bmc.get_upgrade_options }
    end

    tests("#update(opts") do
      bm_opts = {
          :ram => 4
      }
      vm_opts = {
          :ram => 4,
          :maintenance_window => 1111
      }
      data_matches_schema(Hash) { @vm.update(vm_opts) }
      data_matches_schema(Hash) { @bmc.update(bm_opts) }
    end

    tests("#start") do
      returns(true) { @vm.start }
      returns(true) { @bmc.start }
    end

    tests("#stop") do
      returns(true) { @vm.stop }
      returns(true) { @bmc.stop }
    end

    tests("#shutdown") do
      returns(true) { @vm.shutdown }
    end

    tests("#reboot") do
      returns(true) { @vm.reboot }
      returns(true) { @bmc.reboot }
      returns(true) { @vm.reboot(true) }
      returns(true) { @bmc.reboot(true) }
      returns(true) { @vm.reboot(false) }
      returns(true) { @bmc.reboot(false) }
    end
  end

  tests ("failure") do
    
    # should not allow Virtual Guests creation without bare_metal flag
    tests(".new").raises(Exception) do
      # As we don't have fixture I don't touch original vm_opts
      nobm_vm_opts = vm_opts.clone
      nobm_vm_opts.delete(:bare_metal)
      Fog::Compute[:softlayer].servers.new(nobm_vm_opts)
    end
    
    # should not allow Bare Metal creation without bare_metal flag
    tests(".new").raises(Exception) do
      # As we don't have fixture I don't touch original bmc_opts
      nobm_bmc_opts = bmc_opts.clone
      nobm_bmc_opts.delete(:bare_metal)
      Fog::Compute[:softlayer].servers.new(nobm_bmc_opts)
    end
    
    # should not allow a set bare_metal flag manually on Virtual Guests
    tests("#bare_metal=").raises(NoMethodError) do
      @vm.bare_metal = true
    end
    
    # should not allow a set bare_metal flag manually on Bare Metal Servers
    tests("#bare_metal=").raises(NoMethodError) do
      @vm.bare_metal = false
    end
    
    # should not allow a second save
    tests("#save").raises(Fog::Errors::Error) do
      @vm.save
    end

    # bare metal servers dont allow shutdown
    tests("#shutdown").raises(Fog::Errors::Error) do
      @bmc.shutdown
    end

    tests("#destroy") do
      data_matches_schema(String){ @bmc.destroy }
      data_matches_schema(String){ @vm.destroy }
    end

    tests("#update") do
      raises(ArgumentError) { @vm.update }
      raises(ArgumentError) { @bmc.update }
    end
  end
end
