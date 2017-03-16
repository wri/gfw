#
# Author:: Matheus Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
Shindo.tests("Fog::Softlayer[:product] | place_order_test", ["softlayer"]) do

  @sl = Fog::Softlayer[:product]

  tests('success') do
    # should be an empty array
    tests("#place_order") do
      response = @sl.place_order
      data_matches_schema(Hash) { response.body}
      data_matches_schema(200) { response.status }
    end
  end
end
