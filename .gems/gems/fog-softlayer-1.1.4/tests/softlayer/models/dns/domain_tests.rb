#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::DNS[:softlayer] | Domain model", ["softlayer"]) do

  tests("success") do

    @service = Fog::DNS[:softlayer]
    
    # Setup
    name = "fog-domain-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
    @domain = @service.domains.create(name)

    tests("#records") do
      returns(3, "returns 3 default records (SOA / NS1 / NS2)") { @domain.records.count }
    end
    
    tests("#create_record") do
      record = {
        'data' => '127.0.0.1',
        'host' => '@',
        'type' => 'a'
      }
      current_serial = @domain.serial
      @domain.create_record(record)
      @domain.records(true)
      @domain.reload
      returns(true, "returns serial increased") { (current_serial.to_i + 1) <= @domain.serial }
      returns(4, "returns default plus one created, total 4 records") { @domain.records.count }
      returns("127.0.0.1", "returns the right value for created record") { @domain.records.last.value }
      returns("@", "returns the right name for created record") { @domain.records.last.name }
      returns("a", "returns the right type for created record") { @domain.records.last.type }
    end
    
    tests("#destroy") do
      returns(true, "returns confirmation of domain removal") { @domain.destroy }
      returns(false, "returns no domain with that name") { @service.domains.get_by_name(@domain.name) }
    end
    
    # Teardown
    # Not needed, domain was already destroyed
  end
end

