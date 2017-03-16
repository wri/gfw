#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | Packages model", ["softlayer"]) do
  
  @service = Fog::Softlayer[:product]

  tests("success") do

    tests("#all") do
      @packages = @service.packages
      @packages.first(3).each do |package|
        returns(Fog::Softlayer::Product::Package, "returns a #{package.name} package") { package.class }
      end
    end
  end
end

