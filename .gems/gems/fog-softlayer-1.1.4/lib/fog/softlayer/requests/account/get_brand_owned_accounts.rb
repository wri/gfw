#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Account
    class Softlayer
      class Mock
        # Get all accounts who are owned by brand.
        # @param [Integer] identifier
        # @return [Excon::Response]
        def get_brand_owned_accounts(identifier)
          response = Excon::Response.new
          if @brands.select {|brand| brand[:id] == identifier.to_i }.empty?
            response.status = 404
            response.body = {
              "error" => "Unable to find object with id of '#{identifier}'.",
              "code"=>"SoftLayer_Exception_ObjectNotFound"
            }
          else
            response.status = 200
            response.body = mocked_accounts
          end
          response
        end
      end

      class Real
        def get_brand_owned_accounts(identifier)
          request(:brand, "#{identifier}/getOwnedAccounts")
        end
      end
    end
  end
end


module Fog
  module Account
    class Softlayer
      class Mock
        def mocked_accounts
          [
            {
              "accountManagedResourcesFlag"=>false,
              "accountStatusId"=>1001,
              "address1"=>"R 1",
              "allowedPptpVpnQuantity"=>1,
              "brandId"=>23456,
              "city"=>"Itajuba",
              "claimedTaxExemptTxFlag"=>false,
              "companyName"=>"teste",
              "country"=>"BR",
              "createDate"=>"2015-06-10T17:06:27-03:00",
              "email"=>"a@gmail.com",
              "firstName"=>"Matheus2",
              "id"=>23456,
              "isReseller"=>0,
              "lastName"=>"Mina2",
              "lateFeeProtectionFlag"=>nil,
              "modifyDate"=>"2015-06-10T17:06:31-03:00",
              "postalCode"=>"37500-050",
              "state"=>"OT",
              "statusDate"=>nil,
              "brand"=>
                {
                  "catalogId"=>14,
                  "id"=>12345,
                  "keyName"=>"ALS",
                  "longName"=>"als",
                  "name"=>"als",
                  "ownedAccounts"=>
                    [
                      {
                        "accountManagedResourcesFlag"=>false,
                        "accountStatusId"=>1001,
                        "address1"=>"Av, 1303 Sl 10",
                        "address2"=>"Sl 11",
                        "allowedPptpVpnQuantity"=>2,
                        "brandId"=>44443,
                        "city"=>"Itajuba",
                        "claimedTaxExemptTxFlag"=>false,
                        "companyName"=>"Tecnologias LTDA",
                        "country"=>"BR",
                        "createDate"=>"2010-10-06T11:32:30-03:00",
                        "email"=>"sysadmin@example.com.br",
                        "firstName"=>"Xe",
                        "id"=>12345,
                        "isReseller"=>1,
                        "lastName"=>"Silva",
                        "lateFeeProtectionFlag"=>true,
                        "modifyDate"=>"2011-02-14T17:40:23-02:00",
                        "officePhone"=>"+55 35 3629-1616",
                        "postalCode"=>"37500-903",
                        "state"=>"OT",
                        "statusDate"=>nil,
                        "brand"=>nil
                      },
                      nil
                    ]
                }
            }
          ]
        end
      end
    end
  end
end
