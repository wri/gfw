#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::DNS[:softlayer] | Domains model", ["softlayer"]) do
  
  @service = Fog::DNS[:softlayer]

  tests("success") do
    
    tests("#create") do
      name = "fog-domain-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
      @domain = @service.domains.create(name)
      returns(Fog::DNS::Softlayer::Domain) { @service.domains.get(@domain.id).class }
      returns(@domain.name, "returns the object with correct name") { @service.domains.get(@domain.id).name }
      @domain.destroy
    end

    tests("#all") do
      
      # Setup
      # Not made on before block to make test fast
      name1 = "fog-domain1-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
      @domain1 = @service.domains.create(name1)
      name2 = "fog-domain2-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
      @domain2 = @service.domains.create(name2)
      name3 = "fog-domain3-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
      @domain3 = @service.domains.create(name3)
      
      # Tests if we get the 3 domains we created
      @domains = @service.domains.all
      @domains.each do |domain|
        returns(Fog::DNS::Softlayer::Domain, "returns a "+domain.name) { domain.class }
      end
      
      # Check ifs domains we created are included
      domains_names = @domains.map { |domain| domain.name }
      returns(true, "contains domain 1 with name "+@domain1.name) { domains_names.include? @domain1.name }
      returns(true, "contains domain 2 with name "+@domain2.name) { domains_names.include? @domain2.name }
      returns(true, "contains domain 3 with name "+@domain3.name) { domains_names.include? @domain3.name }
      
      # Made this way so test pass even theres other domains on account
      returns(true, "returns at least 3 domains") { @domains.count >= 3 }
      
      # Teardown
      # Do not leave test domains on my account
      @domain1.destroy
      @domain2.destroy
      @domain3.destroy
    end

    name = "fog-domain-"+SecureRandom.random_number(36**12).to_s(36).rjust(12, "0") + ".com"
    @domain = @service.domains.create(name)
    
    tests("#get") do
      returns(Fog::DNS::Softlayer::Domain) { @service.domains.get(@domain.id).class }
      returns(@domain.name, "returns the object with correct name") { @service.domains.get(@domain.id).name }
    end
    
    tests("#get_by_name") do
      returns(Fog::DNS::Softlayer::Domain) { @service.domains.get_by_name(@domain.name).class }
      returns(@domain.name, "returns the object with correct name") { @service.domains.get_by_name(@domain.name).name }
    end
    
    @domain.destroy

  end
end

