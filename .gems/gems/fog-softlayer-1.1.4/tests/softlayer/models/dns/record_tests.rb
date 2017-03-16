#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::DNS[:softlayer] | Record model", ["softlayer"]) do

  @service = Fog::DNS[:softlayer]
  
  tests("success") do
    
    # Setup
    name = "fog-domain-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
    @domain = @service.domains.create(name)

    tests("#save") do
      record = {
        'data' => '127.0.0.1',
        'host' => '@',
        'type' => 'a'
      }
      current_serial = @domain.serial
      @record = @domain.create_record(record)
      @domain.reload
      @domain.records(true)
      returns(4, "returns default plus one created, total 4 records") { @domain.records.count }
      returns(true, "returns serial increased") { (current_serial + 1) <= @domain.serial }
      returns("127.0.0.1", "returns the right value for created record") { @domain.records.last.value }
      @domain.records.last.value = "192.168.0.1"
      current_serial = @domain.serial
      @domain.records.last.save
      @domain.records(true)
      @domain.reload
      returns(4, "returns 4 records (no duplicated)") { @domain.records.count }
      returns("192.168.0.1", "returns the right value for updated record") { @domain.records.last.value }
      returns(true, "returns serial increased") { (current_serial + 1) <= @domain.serial }
    end
    
    tests("#get") do
      @record_get = @service.records.get(@record.id)
      returns(Fog::DNS::Softlayer::Record) { @record_get.class }
      
      tests("after updating the record") do
        @record_get.value = "192.168.10.1"
        @record_get.save
        @record_get.reload
        returns("192.168.10.1", "returns right value") { @record_get.value }
      end
    end
    
    tests("#destroy") do
      current_serial = @domain.serial
      @domain.records.last.destroy
      @domain.records(true)
      @domain.reload
      returns(true, "returns serial increased") { (current_serial + 1) <= @domain.serial }
      returns(3, "returns default records for domain (last was deleted)") { @domain.records.count }
    end
    
    # Teardown
    @domain.destroy

  end
end

