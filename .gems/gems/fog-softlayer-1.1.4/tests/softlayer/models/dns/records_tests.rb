#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::DNS[:softlayer] | Records model", ["softlayer"]) do

  @service = Fog::DNS[:softlayer]
  
  tests("success") do

    # Setup
    name = "fog-domain-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
    @domain = @service.domains.create(name)

    tests("#all") do
      returns(3, "returns default records for domain") { @domain.records.count }
    end
    
    # Teardown
    @domain.destroy

  end
end

