#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Compute[:softlayer] | key_pair requests", ["softlayer"]) do

  @sl_connection = Fog::Compute[:softlayer]

  opts = { :flavor_id => 'm1.small', :os_code => 'UBUNTU_LATEST',  :name => 'matt', :datacenter => 'dal05', :domain => 'example.com', :bare_metal => false}
  @vm = @sl_connection.servers.create(opts)

  opts[:bare_metal] = true
  @bmc = @sl_connection.servers.create(opts)

  @key_gen = Proc.new { string='ssh-rsa ';  while string.length < 380 do; string << Fog::Mock.random_base64(1); end; string; }

  @kp1 = @sl_connection.key_pairs.new
  @kp1.label = 'test-key-1'
  @kp1.key = @key_gen.call
  @kp1.save


  tests('success') do
    tests("#create_key_pair") do
      key = @sl_connection.create_key_pair(:key => @key_gen.call, :label => 'test-key-tmp')
      @kp2 = @sl_connection.key_pairs.get(key.body['id'])
      returns(200) { key.status }
      data_matches_schema(Integer) { key.body['id'] }
    end

    tests("#get_key_pairs") do
      data_matches_schema([Softlayer::Compute::Formats::KeyPair::KP]) { @sl_connection.get_key_pairs.body}
      returns(200) { @sl_connection.get_key_pairs.status }
      returns(2) { @sl_connection.get_key_pairs.body.count }
    end

    tests("#get_key_pair(#{@kp1.id}") do
      data_matches_schema(Softlayer::Compute::Formats::KeyPair::KP) { @sl_connection.get_key_pair(@kp1.id).body }
    end

    tests("#update_key_pair(#{@kp1.id}, 'label' => 'some-new-name'}") do
      returns(true) { @sl_connection.update_key_pair(@kp1.id, 'label' => 'some-new-name').body }
      returns('some-new-name') { @sl_connection.get_key_pair(@kp1.id).body['label'] }
    end

    tests("#delete_key_pair(#{@kp1.id}") do
      returns(true) { @sl_connection.delete_key_pair(@kp1.id).body }
      returns(1) { @sl_connection.get_key_pairs.body.count }
    end
  end

  tests('failure') do
    tests("#get_key_pair").raises(ArgumentError) do
      @sl_connection.get_key_pair
    end

    tests("#get_key_pair(#{@kp1.id}") do
      returns(404) { @sl_connection.get_key_pair(@kp1.id).status }
    end

    tests("#update_key_pair(#{@kp1.id}, 'label' => 'random thing'") do
      returns(404) { @sl_connection.update_key_pair(@kp1.id, 'label' => 'random thing' ).status }
    end

    tests("#delete_key_pair(#{@kp1.id}") do
      returns(404) { @sl_connection.delete_key_pair(@kp1.id).status }
    end
  end
end
