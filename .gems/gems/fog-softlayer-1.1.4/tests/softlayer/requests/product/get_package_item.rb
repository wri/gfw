#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | package_item_test", ["softlayer"]) do

  @sl = Fog::Softlayer[:product]

  tests('success') do
    # should be an empty array
    tests("#get_package_item") do
      tests("for package id 0") do
        tests("for item id 299") do
          data_matches_schema(Array) { @sl.get_package_item(0, 299).body}
          returns(1) { @sl.get_package_item(0, 299).body.size}
        end
        tests("for item id 5914") do
          data_matches_schema(Array) { @sl.get_package_item(0, 5914).body}
          returns(1) { @sl.get_package_item(0, 5914).body.size}
        end
      end
      
      tests("for package id 242") do
        tests("for item id 4123") do
          data_matches_schema(Array) { @sl.get_package_item(242, 4123).body}
          returns(1) { @sl.get_package_item(242, 4123).body.size}
        end
        tests("for item id 4097") do
          data_matches_schema(Array) { @sl.get_package_item(242, 4097).body}
          returns(1) { @sl.get_package_item(242, 4097).body.size}
        end
      end
    end
  end
end
