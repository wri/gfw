#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | Items model", ["softlayer"]) do
  
  @service = Fog::Softlayer[:product]

  tests("success") do

    tests("#all") do
      @items = @service.packages.first.items
      @items.first(3).each do |item|
        returns(Fog::Softlayer::Product::Item, "returns a "+item.description+" package item") { item.class }
      end
    end
    
    tests("#get") do
      returns(Fog::Softlayer::Product::Item) { @service.packages.first.items.get(299).class }
    end

  end
end

