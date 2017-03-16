#
# Author:: Matheus Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Softlayer
    class Product
      class Mock
        def place_order(order_template)
          response = Excon::Response.new
          response.body = place_order_mock
          response.status = 200
          return response
        end

        def place_order_mock
          {
              "orderDate"=>"2015-04-17T11:12:12-06:00",
              "orderDetails"=>{
                  "bigDataOrderFlag"=>false,
                  "billingInformation"=>{
                      "billingAddressLine1"=>"11 Street ",
                      "billingCity"=>"Dallas",
                      "billingCountryCode"=>"US",
                      "billingEmail"=>"example@example.com",
                      "billingNameCompany"=>"Example company",
                      "billingNameFirst"=>"Example name",
                      "billingNameLast"=>"Example last name",
                      "billingPhoneVoice"=>"123.456.7890",
                      "billingPostalCode"=>"12345-6789",
                      "billingState"=>"TX",
                      "cardExpirationMonth"=>nil,
                      "cardExpirationYear"=>nil,
                      "taxExempt"=>0
                  },
                  "billingOrderItemId"=>nil,
                  "containerSplHash"=>"000000002aar43vc200007f66a254432d",
                  "currencyShortName"=>"USD",
                  "extendedHardwareTesting"=>nil,
                  "imageTemplateId"=>nil,
                  "isManagedOrder"=>0,
                  "itemCategoryQuestionAnswers"=>[],
                  "location"=>"37473",
                  "locationObject"=>{
                      "id"=>37213,
                      "longName"=>"Washington 1",
                      "name"=>"wdc01"
                  },
                  "message"=>"",
                  "packageId"=>46,
                  "paymentType"=>"ADD_TO_BALANCE",
                  "postTaxRecurring"=>"0",
                  "postTaxRecurringHourly"=>"0",
                  "postTaxRecurringMonthly"=>"0",
                  "postTaxSetup"=>"0",
                  "preTaxRecurring"=>"0",
                  "preTaxRecurringHourly"=>"0",
                  "preTaxRecurringMonthly"=>"0",
                  "preTaxSetup"=>"0",
                  "presetId"=>nil,
                  "prices"=>[
                      {
                          "hourlyRecurringFee"=>"0",
                          "id"=>1641,
                          "itemId"=>858,
                          "laborFee"=>"0",
                          "oneTimeFee"=>"0",
                          "recurringFee"=>"0",
                          "setupFee"=>"0",
                          "categories"=>[
                              {
                                  "categoryCode"=>"guest_core",
                                  "id"=>80,
                                  "name"=>"Computing Instance"
                              }
                          ],
                          "item"=>{
                              "capacity"=>"2",
                              "description"=>"2 x 2.0 GHz Cores",
                              "id"=>858,
                              "keyName"=>"GUEST_CORES_2",
                              "units"=>"CORE",
                              "bundle"=>[]
                          }
                      },
                      {
                          "hourlyRecurringFee"=>"0",
                          "id"=>1644,
                          "itemId"=>861,
                          "laborFee"=>"0",
                          "oneTimeFee"=>"0",
                          "recurringFee"=>"0",
                          "setupFee"=>"0",
                          "categories"=>[
                              {
                                  "categoryCode"=>"ram",
                                  "id"=>3,
                                  "name"=>"RAM"
                              }
                          ],
                          "item"=>{
                              "capacity"=>"1",
                              "description"=>"1 GB",
                              "id"=>861,
                              "keyName"=>"RAM_1_GB",
                              "units"=>"GB",
                              "bundle"=>[]
                          }
                      },
                      {
                          "hourlyRecurringFee"=>"0",
                          "id"=>2202,
                          "itemId"=>1178,
                          "laborFee"=>"0",
                          "oneTimeFee"=>"0",
                          "recurringFee"=>"0",
                          "setupFee"=>"0",
                          "categories"=>[{
                                             "categoryCode"=>"guest_disk0",
                                             "id"=>81,
                                             "name"=>"First Disk"
                                         }
                          ],
                          "item"=>{
                              "capacity"=>"25",
                              "description"=>"25 GB (SAN)",
                              "id"=>1178,
                              "keyName"=>"GUEST_DISK_25_GB_SAN",
                              "units"=>"GB",
                              "bundle"=>[]}
                      }
                  ],
                  "primaryDiskPartitionId"=>nil,
                  "privateCloudOrderFlag"=>false,
                  "properties"=>[{
                                     "name"=>"MAINTENANCE_WINDOW",
                                     "value"=>"2015-04-17T14:11:20-03:00"
                                 }
                  ],
                  "proratedInitialCharge"=>"0",
                  "proratedOrderTotal"=>"0",
                  "quantity"=>1,
                  "resourceGroupId"=>nil,
                  "resourceGroupTemplateId"=>nil,
                  "sendQuoteEmailFlag"=>nil,
                  "serverCoreCount"=>nil,
                  "sourceVirtualGuestId"=>nil,
                  "sshKeys"=>[],
                  "stepId"=>nil,
                  "storageGroups"=>[],
                  "taxCacheHash"=>"ec46bb1535b09a7df30b2f8204d7363eae96f028",
                  "taxCompletedFlag"=>true,
                  "totalRecurringTax"=>"0",
                  "totalSetupTax"=>"0",
                  "useHourlyPricing"=>true,
                  "virtualGuests"=>[{
                                        "accountId"=>307608,
                                        "domain"=>"domain.com",
                                        "fullyQualifiedDomainName"=>"hostname.domain.com",
                                        "hostname"=>"hostname",
                                        "id"=>8843591,
                                        "maxCpu"=>1,
                                        "maxCpuUnits"=>"CORE",
                                        "maxMemory"=>1024,
                                        "startCpus"=>1,
                                        "statusId"=>1001,
                                        "uuid"=>"77edc9a5-2ee2-fa9f-ac5a-3387ed482729",
                                        "globalIdentifier"=>"0b304f83-b721-4d7b-a691-027085553b94"
                                    }
                  ],
                  "monitoringAgentConfigurationTemplateGroupId"=>nil},
              "orderId"=>1213232,
              "placedOrder"=>{
                  "accountId"=>434334,
                  "id"=>434334,
                  "orderQuoteId"=>nil,
                  "orderTypeId"=>4,
                  "presaleEventId"=>nil,
                  "status"=>"PENDING_UPGRADE",
                  "userRecordId"=>434334,
                  "account"=>{
                      "brandId"=>2,
                      "companyName"=>"Example company",
                      "id"=>307608},
                  "items"=>[{
                                "categoryCode"=>"guest_core",
                                "description"=>"2 x 2.0 GHz Cores",
                                "hourlyRecurringFee"=>"0",
                                "id"=>4434334,
                                "itemId"=>858,
                                "itemPriceId"=>"1641",
                                "laborFee"=>"0",
                                "oneTimeFee"=>"0",
                                "parentId"=>nil,
                                "promoCodeId"=>nil,
                                "recurringFee"=>"0",
                                "setupFee"=>"0",
                                "children"=>[]},
                            {
                                "categoryCode"=>"ram",
                                "description"=>"1 GB",
                                "hourlyRecurringFee"=>"0",
                                "id"=>34343,
                                "itemId"=>861,
                                "itemPriceId"=>"1644",
                                "laborFee"=>"0",
                                "oneTimeFee"=>"0",
                                "parentId"=>nil,
                                "promoCodeId"=>nil,
                                "recurringFee"=>"0",
                                "setupFee"=>"0",
                                "children"=>[]},
                            {
                                "categoryCode"=>"guest_disk0",
                                "description"=>"25 GB (SAN)",
                                "hourlyRecurringFee"=>"0",
                                "id"=>64357837,
                                "itemId"=>1178,
                                "itemPriceId"=>"2202",
                                "laborFee"=>"0",
                                "oneTimeFee"=>"0",
                                "parentId"=>nil,
                                "promoCodeId"=>nil,
                                "recurringFee"=>"0",
                                "setupFee"=>"0",
                                "children"=>[]}],
                  "userRecord"=>{
                      "accountId"=>4344343,
                      "firstName"=>"Example name",
                      "id"=>302942,
                      "lastName"=>"Example last name",
                      "username"=>"example-username"
                  }
              }
          }
        end
      end

      class Real
        def place_order(order_template)
          request(:product_order, :place_order, :body => order_template, :http_method => :POST)
        end
      end
    end
  end
end
