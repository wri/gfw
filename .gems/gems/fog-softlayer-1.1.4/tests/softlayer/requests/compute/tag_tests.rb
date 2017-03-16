#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Compute[:softlayer] | tag requests", ["softlayer"]) do

  @sl_connection = Fog::Compute[:softlayer]

  opts = { :flavor_id => 'm1.small', :os_code => 'UBUNTU_LATEST',  :name => 'matt', :datacenter => 'dal05', :domain => 'example.com', :bare_metal => false}
  @vm = @sl_connection.servers.create(opts)

  opts[:bare_metal] = true
  @bmc = @sl_connection.servers.create(opts)

  test_tags = ['foo', 'bar', 'baz']

  tests('success') do
    tests("#create_vm_tags('#{@vm.id}', #{test_tags})") do
      returns(true, "returns true") { @sl_connection.create_vm_tags(@vm.id, test_tags).body}
      end

    tests("#create_bare_metal_tags('#{@bmc.id}', #{test_tags})") do
      returns(true, "returns true") { @sl_connection.create_bare_metal_tags(@bmc.id, test_tags).body }
    end

    tests("#get_vm_tags('#{@vm.id}')") do
      data_matches_schema(Softlayer::Compute::Formats::VirtualGuest::TAGS, {:allow_extra_keys => true}) { @sl_connection.get_vm_tags(@vm.id).body['tagReferences'].first }
    end

    tests("#get_bare_metal_tags('#{@bmc.id}')") do
      data_matches_schema(Softlayer::Compute::Formats::BareMetal::TAGS, {:allow_extra_keys => true}) { @sl_connection.get_bare_metal_tags(@bmc.id).body['tagReferences'].first }
    end

    tests("#delete_vm_tags('#{@vm.id}')") do
      returns(3, "three tags for VM with id #{@vm.id}") { @sl_connection.get_vm_tags(@vm.id).body['tagReferences'].count }
      returns(true, "returns true") { @sl_connection.delete_vm_tags(@vm.id, ['foo', 'bar']).body }
      returns(1, "one tag remains for VM with id #{@vm.id}") { @sl_connection.get_vm_tags(@vm.id).body['tagReferences'].count }
    end

    tests("#delete_bare_metal_tags('#{@bmc.id}')") do
      returns(3, "three tags for BM server with id #{@bmc.id}") { @sl_connection.get_bare_metal_tags(@bmc.id).body['tagReferences'].count }
      returns(true, "returns true") { @sl_connection.delete_bare_metal_tags(@bmc.id, ['foo', 'bar']).body }
      returns(1, "one tag remains for BM server with id #{@bmc.id}") { @sl_connection.get_bare_metal_tags(@bmc.id).body['tagReferences'].count }
    end

  end

  tests('failure') do

    tests("#create_vm_tags(123456789, #{test_tags})") do
      returns(404, "server doesn't exist") { @sl_connection.create_vm_tags(123456789).status }
    end

    tests("#create_bare_metal_tags(123456789, #{test_tags})") do
      returns(404, "server doesn't exist") { @sl_connection.create_bare_metal_tags(123456789).status }
    end

    tests("#get_vm_tags(123456789)") do
      returns(404, "server doesn't exist") { @sl_connection.get_vm_tags(123456789).status }
    end

    tests("#get_bare_metal_tags(123456789)") do
      returns(404, "server doesn't exist") { @sl_connection.get_bare_metal_tags(123456789).status }
    end

    tests("#delete_vm_tags(123456789, #{test_tags})") do
      returns(404, "server doesn't exist") { @sl_connection.delete_vm_tags(123456789, test_tags).status }
    end

    tests("#delete_bare_metal_tags(123456789, #{test_tags})") do
      returns(404, "server doesn't exist") { @sl_connection.delete_bare_metal_tags(123456789, test_tags).status }
    end

    tests("#delete_bare_metal_tags(123456789, #{test_tags})") do
      returns(404, "server doesn't exist") { @sl_connection.delete_bare_metal_tags(123456789, test_tags).status }
    end

    tests("#create_vm_tags").raises(ArgumentError) do
      @sl_connection.create_vm_tags(@vm.id, 'foo')
    end

    tests("#create_bare_metal_tags").raises(ArgumentError) do
      @sl_connection.create_bare_metal_tags(@vm.id, 'foo')
    end

  end

end
