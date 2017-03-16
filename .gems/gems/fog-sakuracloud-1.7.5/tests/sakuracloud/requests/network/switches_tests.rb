# coding: utf-8
Shindo.tests('Fog::Network[:sakuracloud] | list_switches request', ['sakuracloud', 'network']) do

  @switches_format = {
    'Index'          => Integer,
    'ID'             => String,
    'Name'           => String,
    'ServerCount'    => Integer,
    'ApplianceCount' => Integer,
    'Subnets'        => Array
  }

  tests('success') do

    tests('#list_switches') do
      switches = sakuracloud_network_service.list_switches
      test 'returns a Hash' do
        switches.body.is_a? Hash
      end
      if Fog.mock?
        tests('Switches').formats(@switches_format, false) do
          switches.body['Switches'].first
        end
      else
        returns(200) { switches.status }
        returns(true) { switches.body.is_a? Hash }
      end
    end
  end
end

Shindo.tests('Fog::Network[:sakuracloud] | create_switch request', ['sakuracloud', 'network']) do
  tests('success') do
    tests('#create_simple_switch') do
      switch = sakuracloud_network_service.create_switch(:name => 'foobar')
      test 'returns a Hash' do
        switch.body.is_a? Hash
      end

      unless Fog.mock?
        returns(201) { switch.status }
        returns(true) { switch.body.is_a? Hash }
      end
    end
  end
end
