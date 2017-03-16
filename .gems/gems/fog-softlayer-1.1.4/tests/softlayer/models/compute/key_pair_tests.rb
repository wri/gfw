#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Compute[:softlayer] | KeyPair model", ["softlayer"]) do
  pending unless Fog.mocking?

  @sl_connection = Fog::Compute[:softlayer]
  @key_gen = Proc.new { string='ssh-rsa ';  while string.length < 380 do; string << Fog::Mock.random_base64(1); end; string; }
  @kp1 = @sl_connection.key_pairs.create(:label => 'test-key-1', :key => @key_gen.call)

  tests("success") do

    tests("#label=") do
      returns('new-label') { @kp1.label = 'new-label' }
    end

    tests("#label") do
      returns('new-label') { @kp1.label}
    end

    tests("#key=") do
      @new_key_value = @key_gen.call
      returns(@new_key_value) { @kp1.key = @new_key_value }
    end

    tests("#key") do
      returns(@new_key_value) { @kp1.key }
    end

    tests("#create(:label => 'test-key-2', :key => #{@key_gen.call}") do
      data_matches_schema(Fog::Compute::Softlayer::KeyPair) { @sl_connection.key_pairs.create(:label => 'test-key-2', :key => @key_gen.call)}
    end

    tests("#destroy") do
      returns(true) { @sl_connection.key_pairs.first.destroy }
    end

  end

  tests ("failure") do
    # ToDo: Failure cases.
  end
end
