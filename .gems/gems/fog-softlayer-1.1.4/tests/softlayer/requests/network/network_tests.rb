#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Network[:softlayer] | network requests", ["softlayer"]) do

  @sl = Fog::Network[:softlayer]

  @order = {
      'complexType' => 'SoftLayer_Container_Product_Order_Network_Vlan',
      'name' => 'test-vlan',
      'routerId' => 1234,
      'router' => 'fcr01a.xxx01',
      'location' => 1234,
      'quantity' =>1,
      'packageId' =>0,
      'prices' =>[
          {'id' => 42 },
          {'id' => 42 },
      ]
  }


  tests('success') do

    tests("#get_private_vlan_price_code") do
      data_matches_schema(Integer) { @sl.get_private_vlan_price_code }
    end

    tests("#get_public_vlan_price_code") do
      data_matches_schema(Integer) { @sl.get_public_vlan_price_code }
    end

    tests("#get_subnet_package_id") do
      data_matches_schema(Integer) { @sl.get_subnet_package_id('PUBLIC') }
    end

    tests("#get_subnet_price_code") do
      data_matches_schema(Integer) { @sl.get_subnet_price_code(4) }
    end

    tests("#create_network(#{@order})") do
      returns(@order['router']) { @sl.create_network(@order).body['orderDetails']['router']['hostname'] }
      returns(200) { @sl.create_network(@order).status }
    end

    tests("#list_networks") do
      @network_ids = @sl.list_networks.body.map { |vlan| vlan['id'] }
      returns(2) { @network_ids.count }
    end

    tests("#get_network(#{@network_ids[0]})") do
      returns(200) { @sl.get_network(@network_ids[0]).status}
      returns(200) { @sl.get_network(@network_ids[1]).status}
    end

    tests("#create_network_tags(#{@network_ids[0]}, ['sparkle', 'motion'])") do
      returns(200) { @sl.create_network_tags(@network_ids[0], ['sparkle', 'motion']).status }
    end

    tests("#get_network_tags(#{@network_ids[0]})") do
      tags = @sl.get_network_tags(@network_ids[0]).body['tagReferences'].map { |ref| ref['tag']['name'] }
      returns(2) { tags.count }
      returns(true) { ['sparkle', 'motion'].include?(tags[0]) }
      returns(true) { ['sparkle', 'motion'].include?(tags[1]) }
    end

    tests("#delete_network_tags(#{@network_ids[0]}, ['sparkle'])") do
      returns(200) { @sl.delete_network_tags(@network_ids[0], ['sparkle']).status }
      tags = @sl.get_network_tags(@network_ids[0]).body['tagReferences'].map { |ref| ref['tag']['name'] }
      returns(1) { tags.count }
      returns(false) { ['sparkle'].include?( tags[0]) }
      returns(true) { ['motion'].include?( tags[0]) }
    end

    tests("#delete_network(#{@network_ids[1]})") do
      response = @sl.delete_network(@network_ids[1])
      returns(200) { response.status }
      returns(true) { response.body }
    end




  end

  tests('failure') do
    tests("#create_network").raises(ArgumentError) do
      @sl.create_network
    end

    tests("#get_network").raises(ArgumentError) do
      @sl.get_network
    end

    tests("#get_network(#{@network_ids[1]})") do
      returns(404) { @sl.get_network(@network_ids[1]).status }
    end

    tests("#create_network_tags(#{@network_ids[1]}, ['sparkle', 'motion'])") do
      returns(404) { @sl.create_network_tags(@network_ids[1], ['sparkle', 'motion']).status }
    end

    tests("#create_network_tags(#{@network_ids[0]}, 'sparkle,motion')").raises(ArgumentError) do
      @sl.create_network_tags(@network_ids[0], 'sparkle,motion').status
    end

    tests("#get_network_tags(#{@network_ids[1]})") do
      returns(404) { @sl.get_network_tags(@network_ids[1]).status }
    end

    tests("#delete_network_tags(#{@network_ids[1]}, ['sparkle'])") do
      returns(404) { @sl.delete_network_tags(@network_ids[1], ['sparkle']).status }
    end

    tests("#delete_network_tags(#{@network_ids[0]}, 'sparkle')").raises(ArgumentError) do
      @sl.delete_network_tags(@network_ids[0], 'sparkle').status
    end

    tests("#delete_network(#{@network_ids[1]})") do
      returns(404) { @sl.delete_network(@network_ids[1]).status }
    end


  end
end
