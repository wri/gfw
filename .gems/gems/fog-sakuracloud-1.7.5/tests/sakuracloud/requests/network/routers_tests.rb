# coding: utf-8
Shindo.tests('Fog::Network[:sakuracloud] | list_routers request', ['sakuracloud', 'network']) do

  @routers_create_format = {
    'Index'          => Integer,
    'ID'             => String,
    'Name'           => String,
    'BandWidthMbps'  => Integer,
    'NetworkMaskLen' => Integer,
    'Switch'         => Hash
  }

  @routers_list_format = {
    'Index'          => Integer,
    'ID'             => String,
    'Switch'         => Hash
  }

  tests('success') do

    tests('#list_routers') do
      routers = sakuracloud_network_service.list_routers
      test 'returns a Hash' do
        routers.body.is_a? Hash
      end
      if Fog.mock?
        tests('Routers').formats(@routers_list_format, false) do
          routers.body['Internet'].first
        end
      else
        returns(200) { routers.status }
        returns(true) { routers.body.is_a? Hash }
      end
    end
  end
end

Shindo.tests('Fog::Network[:sakuracloud] | create_router request', ['sakuracloud', 'network']) do
  tests('success') do
    tests('#create_router_with_internet_access') do
      router = sakuracloud_network_service.create_router(:name => 'foobar', :networkmasklen => 28)
      test 'returns a Hash' do
        router.body.is_a? Hash
      end

      unless Fog.mock?
        returns(202) { router.status }
        returns(true) { router.body.is_a? Hash }
      end
    end
  end
end
