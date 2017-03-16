#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | Item model", ["softlayer"]) do

  tests("success") do

    @service = Fog::Softlayer[:product]
    
    # Setup
    @item = @service.packages.first.items.get(299)

    tests("#attributes") do
      returns(299, "id") { @item.id }
      returns(10.0, "capacity") { @item.capacity }
      returns("10Mbps Hardware Firewall", "description") { @item.description }
      returns(166, "category for item tax") { @item.item_tax_category_id }
      returns("10MBPS_HARDWARE_FIREWALL", "key name") { @item.key_name }
      returns(nil, "long description") { @item.long_description }
      returns(0, "software description id") { @item.software_description_id }
      returns("Mbps", "metric unit for item") { @item.units }
      returns(0, "upgrade item id") { @item.upgrade_item_id }
    end
  end
end