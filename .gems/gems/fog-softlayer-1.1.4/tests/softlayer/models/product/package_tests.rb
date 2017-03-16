#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | Package model", ["softlayer"]) do

  tests("success") do

    @service = Fog::Softlayer[:product]
    
    # Setup
    @package = @service.packages.first

    tests("#attributes") do
      returns(0, "id") { @package.id }
      returns(nil, "description") { @package.description }
      returns(1, "if first step on order") { @package.first_order_step_id }
      returns(1, "if is active") { @package.is_active }
      returns("Additional Products", "package name") { @package.name }
      returns(nil, "sub description") { @package.sub_description }
      returns(0, "unit size") { @package.unit_size }
    end
    
    tests("#items") do
      returns(Fog::Softlayer::Product::Items) { @package.items.class }
    end
  end
end