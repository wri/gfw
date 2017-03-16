#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
Shindo.tests("Fog::Account[:softlayer] | account requests", ["softlayer"]) do
  @sl = Fog::Account[:softlayer]

  tests('success') do
    tests"#get_account_owned_brands('1')" do
      response = @sl.get_account_owned_brands(1)
      data_matches_schema(200) { response.status }
      data_matches_schema(Array) { response.body }
    end

    tests"#get_account_owned_brands('1')" do
      response = @sl.get_account_owned_brands(1)
      data_matches_schema(200) { response.status }
      data_matches_schema(Array) { response.body }
    end
  end

  tests('failure') do
    tests("#get_account_owned_brands('99999999')") do
      response = @sl.get_account_owned_brands(99999999)
      data_matches_schema('SoftLayer_Exception_ObjectNotFound'){ response.body['code'] }
      data_matches_schema(404){ response.status }
    end
  end
end
