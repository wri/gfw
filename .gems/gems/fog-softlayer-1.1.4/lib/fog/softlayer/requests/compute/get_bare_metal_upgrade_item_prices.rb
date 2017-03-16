#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Compute
    class Softlayer
      class Mock
        # Gets all Bare Metal upgrade item prices
        # @param [Integer] id
        # @return [Excon::Response]
        def get_bare_metal_upgrade_item_prices(id)
          response = Excon::Response.new
          found = self.get_bare_metal_servers.body.map{|server| server['id']}.include?(id.to_s)
          unless found
            response.status = 404
            response.body = {
                "error" => "Unable to find object with id of '#{id}'.",
                "code" => "SoftLayer_Exception_ObjectNotFound"
            }
          else
            response.status = 200
            response.body = get_upgrade_item_prices
          end
          response
        end
      end

      class Real
        def get_bare_metal_upgrade_item_prices(id)
          request(:hardware_server, "#{id}/getUpgradeItemPrices")
        end
      end
    end
  end
end

module Fog
  module Compute
    class Softlayer
      class Mock
        def get_upgrade_options
            [
                {
                    "currentPriceFlag"=>true,
                    "id"=>342,
                    "itemId"=>249,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"bandwidth",
                            "id"=>10,
                            "name"=>"Public Bandwidth",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"20000",
                        "description"=>"20000 GB Bandwidth",
                        "id"=>249,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"BANDWIDTH_20000_GB",
                        "softwareDescriptionId"=>nil,
                        "units"=>"GB",
                        "upgradeItemId"=>nil,
                        "attributes"=>[],
                        "requirements"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "id"=>125,
                    "itemId"=>97,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"2000",
                    "setupFee"=>"0",
                    "sort"=>5,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"bandwidth",
                            "id"=>10,
                            "name"=>"Public Bandwidth",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "description"=>"Unlimited Bandwidth (100 Mbps Uplink)",
                        "id"=>97,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"BANDWIDTH_UNLIMITED_100_MBPS_UPLINK",
                        "softwareDescriptionId"=>nil,
                        "upgradeItemId"=>nil,
                        "attributes"=>[],
                        "requirements"=>[
                            {
                                "id"=>4,
                                "itemId"=>97,
                                "requiredItemId"=>187,
                                "item"=>{
                                    "capacity"=>"100",
                                    "description"=>"100 Mbps Public & Private Network Uplinks",
                                    "id"=>187,
                                    "itemTaxCategoryId"=>166,
                                    "keyName"=>"100_MBPS_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                                    "softwareDescriptionId"=>nil,
                                    "units"=>"Mbps",
                                    "upgradeItemId"=>188,
                                    "attributes"=>[]
                                }
                            }
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>true,
                    "hourlyRecurringFee"=>"0",
                    "id"=>273,
                    "itemId"=>187,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>2,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"100",
                        "description"=>"100 Mbps Public & Private Network Uplinks",
                        "id"=>187,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"100_MBPS_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>188,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>".04",
                    "id"=>274,
                    "itemId"=>188,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"20",
                    "setupFee"=>"0",
                    "sort"=>3,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"1000",
                        "description"=>"1 Gbps Public & Private Network Uplinks",
                        "id"=>188,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"1_GBPS_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>"0",
                    "id"=>272,
                    "itemId"=>186,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>5,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"10",
                        "description"=>"10 Mbps Public & Private Network Uplinks",
                        "id"=>186,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"10_MBPS_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>187,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>".02",
                    "id"=>21509,
                    "itemId"=>4332,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"10",
                    "setupFee"=>"0",
                    "sort"=>11,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"10",
                        "description"=>"10 Mbps Redundant Public & Private Network Uplinks",
                        "id"=>4332,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"10_MBPS_REDUNDANT_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>4336,
                        "attributes"=>[
                            {
                                "id"=>831,
                                "itemAttributeTypeId"=>2,
                                "itemId"=>4332,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"DUAL_PATH_NETWORK",
                                    "name"=>"Dual-Path Networking"},
                                "attributeTypeKeyName"=>"DUAL_PATH_NETWORK"}
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>".03",
                    "id"=>21513,
                    "itemId"=>4336,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"20",
                    "setupFee"=>"0",
                    "sort"=>12,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"100",
                        "description"=>"100 Mbps Redundant Public & Private Network Uplinks",
                        "id"=>4336,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"100_MBPS_REDUNDANT_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>1284,
                        "attributes"=>[
                            {
                                "id"=>1000,
                                "itemAttributeTypeId"=>2,
                                "itemId"=>4336,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"DUAL_PATH_NETWORK",
                                    "name"=>"Dual-Path Networking"},
                                "attributeTypeKeyName"=>"DUAL_PATH_NETWORK"}
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>".05",
                    "id"=>2314,
                    "itemId"=>1284,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"40",
                    "setupFee"=>"0",
                    "sort"=>13,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"1000",
                        "description"=>"1 Gbps Redundant Public & Private Network Uplinks",
                        "id"=>1284,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"1_GBPS_REDUNDANT_PUBLIC_PRIVATE_NETWORK_UPLINKS",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>nil,
                        "attributes"=>[
                            {
                                "id"=>8,
                                "itemAttributeTypeId"=>2,
                                "itemId"=>1284,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"DUAL_PATH_NETWORK",
                                    "name"=>"Dual-Path Networking"},
                                "attributeTypeKeyName"=>"DUAL_PATH_NETWORK"}
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>".04",
                    "id"=>21141,
                    "itemId"=>4263,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"20",
                    "setupFee"=>"0",
                    "sort"=>33,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"1000",
                        "description"=>"1 Gbps Dual Public & Private Network Uplinks (Unbonded)",
                        "id"=>4263,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"1_GBPS_DUAL_PUBLIC_PRIVATE_NETWORK_UPLINKS_UNBONDED",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>nil,
                        "attributes"=>[
                            {
                                "id"=>1241,
                                "itemAttributeTypeId"=>2,
                                "itemId"=>4263,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"DUAL_PATH_NETWORK",
                                    "name"=>"Dual-Path Networking"},
                                "attributeTypeKeyName"=>"DUAL_PATH_NETWORK"},
                            {
                                "id"=>649,
                                "itemAttributeTypeId"=>78,
                                "itemId"=>4263,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"NON_LACP",
                                    "name"=>"Non Link Aggregation Control Protocol (Unbonded)"},
                                "attributeTypeKeyName"=>"NON_LACP"}
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "hourlyRecurringFee"=>"0",
                    "id"=>40640,
                    "itemId"=>5118,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>34,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"port_speed",
                            "id"=>26,
                            "name"=>"Uplink Port Speeds",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"100",
                        "description"=>"100 Mbps Dual Public & Private Network Uplinks (Unbonded)",
                        "id"=>5118,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"100_MBPS_DUAL_PUBLIC_PRIVATE_NETWORK_UPLINKS_UNBONDED",
                        "softwareDescriptionId"=>nil,
                        "units"=>"Mbps",
                        "upgradeItemId"=>nil,
                        "attributes"=>[
                            {
                                "id"=>1508,
                                "itemAttributeTypeId"=>2,
                                "itemId"=>5118,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"DUAL_PATH_NETWORK",
                                    "name"=>"Dual-Path Networking"},
                                "attributeTypeKeyName"=>"DUAL_PATH_NETWORK"},
                            {
                                "id"=>1506,
                                "itemAttributeTypeId"=>78,
                                "itemId"=>5118,
                                "value"=>"1",
                                "attributeType"=>{
                                    "keyName"=>"NON_LACP",
                                    "name"=>"Non Link Aggregation Control Protocol (Unbonded)"},
                                "attributeTypeKeyName"=>"NON_LACP"}
                        ]

                    }
                },
                {
                    "currentPriceFlag"=>true,
                    "id"=>20,
                    "itemId"=>14,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"disk0",
                            "id"=>4,
                            "name"=>"First Hard Drive",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"500",
                        "description"=>"500 GB SATA II",
                        "id"=>14,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"HARD_DRIVE_500GB_SATA_II",
                        "softwareDescriptionId"=>nil,
                        "units"=>"GB",
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>true,
                    "id"=>637,
                    "itemId"=>104,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"ram",
                            "id"=>3,
                            "name"=>"RAM",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"2",
                        "description"=>"2 GB DDR2 667",
                        "id"=>104,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"RAM_2_GB_DDR2_667_NON_REG",
                        "softwareDescriptionId"=>nil,
                        "units"=>"GB",
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "id"=>1028,
                    "itemId"=>106,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"28",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"ram",
                            "id"=>3,
                            "name"=>"RAM",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"4",
                        "description"=>"4 GB DDR2 667",
                        "id"=>106,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"RAM_4_GB_DDR2_667_NON_REG",
                        "softwareDescriptionId"=>nil,
                        "units"=>"GB",
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>true,
                    "hourlyRecurringFee"=>"0",
                    "id"=>876,
                    "itemId"=>487,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"0",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"disk_controller",
                            "id"=>11,
                            "name"=>"Disk Controller",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "description"=>"Non-RAID",
                        "id"=>487,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"DISK_CONTROLLER_NONRAID",
                        "softwareDescriptionId"=>nil,
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                },
                {
                    "currentPriceFlag"=>false,
                    "id"=>1268,
                    "itemId"=>14,
                    "laborFee"=>"0",
                    "locationGroupId"=>nil,
                    "onSaleFlag"=>nil,
                    "oneTimeFee"=>"0",
                    "quantity"=>nil,
                    "recurringFee"=>"21",
                    "setupFee"=>"0",
                    "sort"=>0,
                    "accountRestrictions"=>[],
                    "categories"=>[
                        {
                            "categoryCode"=>"disk1",
                            "id"=>5,
                            "name"=>"Second Hard Drive",
                            "quantityLimit"=>0}
                    ],
                    "item"=>{
                        "capacity"=>"500",
                        "description"=>"500 GB SATA II",
                        "id"=>14,
                        "itemTaxCategoryId"=>166,
                        "keyName"=>"HARD_DRIVE_500GB_SATA_II",
                        "softwareDescriptionId"=>nil,
                        "units"=>"GB",
                        "upgradeItemId"=>nil,
                        "attributes"=>[]
                    }
                }
            ]
        end
      end
    end
  end
end