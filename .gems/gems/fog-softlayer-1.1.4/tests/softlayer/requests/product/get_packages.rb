#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Softlayer[:product] | packages_test", ["softlayer"]) do

  @sl = Fog::Softlayer[:product]

  tests('success') do
    # should be an empty array
    tests("#get_packages") do
      data_matches_schema(Array) { @sl.get_packages.body}
      returns(129) { @sl.get_packages.body.size}
    end
  end
end
