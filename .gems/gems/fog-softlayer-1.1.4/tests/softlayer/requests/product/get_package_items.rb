#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | package_items_test", ["softlayer"]) do

  @sl = Fog::Softlayer[:product]

  tests('success') do
    # should be an empty array
    tests("#get_package_items") do
      tests("for id 0") do
        data_matches_schema(Array) { @sl.get_package_items(0).body}
        returns(261) { @sl.get_package_items(0).body.size}
      end
      
      tests("for id 242") do
        data_matches_schema(Array) { @sl.get_package_items(242).body}
        returns(28) { @sl.get_package_items(242).body.size}
      end
    end
  end
end
