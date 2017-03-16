#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Account[:softlayer] | brand model", ["softlayer"]) do
  @sl = Fog::Account[:softlayer]

  tests 'success' do
    attributes = {
      'key_name' => "T_B",
      'long_name' => "Long Test Brand Name",
      'name' => "My name",
      'account' => {}
    }

    tests '#save' do
      @brand = @sl.brands.new(attributes)
      response = @brand.save
      data_matches_schema(Softlayer::Account::Formats::Collected::BRAND) { response }
    end

    tests '#create' do
      @brand = @sl.brands.new(attributes)
      response = @brand.create
      @brand.id = response[:id]
      data_matches_schema(Softlayer::Account::Formats::Collected::BRAND) { response }
    end

    tests '#get_accounts' do
      data_matches_schema(Array) { @brand.get_accounts }
    end
  end

  tests 'failure' do
    attributes = {
      'key_name' => "T_B",
      'long_name' => "Long Test Brand Name",
      'name' => "My name",
    }

    tests '#save' do
      @brand = @sl.brands.new(attributes)
      response = @brand.save
      data_matches_schema(Hash) { response }
    end

    tests '#save' do
      @brand.id = 1
      raises(StandardError) { @brand.save }
    end

    tests '#create' do
      @brand = @sl.brands.new(attributes)
      response = @brand.create
      data_matches_schema(Hash) { response }
    end

    tests '#get_accounts' do
      response = @brand.get_accounts
      data_matches_schema(Hash) { response }
    end
  end
end
