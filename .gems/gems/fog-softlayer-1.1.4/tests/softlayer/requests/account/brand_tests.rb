#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
Shindo.tests("Fog::Account[:softlayer] | brand requests", ["softlayer"]) do
  @sl = Fog::Account[:softlayer]

  tests 'success' do
    attributes = {
      :keyName => "BRAND_NAME",
      :longName => "Your Long Brand Name",
      :name => "Brand Name",
      :account => {}
    }

    tests '#create_brand(attributes)' do
      response = @sl.create_brand(attributes)
      @brand_id = response.body[:id]
      data_matches_schema(201) { response.status }
      data_matches_schema(Softlayer::Account::Formats::Brand::BRAND) { response.body }
    end

    tests "#get_brand('@brand_id')" do
      response = @sl.get_brand(@brand_id)
      data_matches_schema(200) { response.status }
      data_matches_schema(Softlayer::Account::Formats::Brand::BRAND) { response.body }
    end

    tests "#get_brand_owned_accounts('@brand_id')" do
      response = @sl.get_brand_owned_accounts(@brand_id)
      data_matches_schema(200) { response.status }
      data_matches_schema(Array) { response.body }
    end
  end

  tests 'failure' do
    tests "#get_brand('99999999')" do
      response = @sl.get_brand(99999999)
      data_matches_schema('SoftLayer_Exception_ObjectNotFound'){ response.body['code'] }
      data_matches_schema(404){ response.status }
    end

    tests "#get_brand()" do
      raises(ArgumentError) { @sl.get_brand }
    end

    tests "#get_brand_owned_accounts('99999999')" do
      response = @sl.get_brand_owned_accounts(99999999)
      data_matches_schema('SoftLayer_Exception_ObjectNotFound'){ response.body['code'] }
      data_matches_schema(404){ response.status }
    end

    tests "#get_brand_owned_accounts()" do
      raises(ArgumentError) { @sl.get_brand_owned_accounts }
    end
  end
end
