#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Compute
    class Softlayer
      class Mock
        def get_available_preset_codes
          {
              "fixedConfigurationPresets" =>
                  [{"preset"=>{"description"=>"Single Xeon 1270, 8GB Ram, 2x1TB SATA disks, Non-RAID", "keyName"=>"S1270_8GB_2X1TBSATA_NORAID", "totalMinimumHourlyFee"=>".368", "totalMinimumRecurringFee"=>"244"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"S1270_8GB_2X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Single Xeon 1270, 32GB Ram, 1x1TB SATA disks, Non-RAID", "keyName"=>"S1270_32GB_1X1TBSATA_NORAID", "totalMinimumHourlyFee"=>".595", "totalMinimumRecurringFee"=>"395"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"S1270_32GB_1X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2620, 32GB Ram, 4x1TB SATA disks, Non-RAID", "keyName"=>"D2620_32GB_4X1TBSATA_NORAID", "totalMinimumHourlyFee"=>".786", "totalMinimumRecurringFee"=>"522"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2620_32GB_4X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2620, 64GB Ram, 2x1TB SATA disks, Non-RAID", "keyName"=>"D2620_64GB_2X1TBSATA_NORAID", "totalMinimumHourlyFee"=>".978", "totalMinimumRecurringFee"=>"649"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2620_64GB_2X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Single Xeon 1270, 32GB Ram, 2x960GB SSD disks, Non-RAID", "keyName"=>"S1270_32GB_2X400GBSSD_NORAID", "totalMinimumHourlyFee"=>"1.057", "totalMinimumRecurringFee"=>"701"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"S1270_32GB_2X400GBSSD_NORAID"}}},
                   {"preset"=>{"description"=>"Single Xeon 1270, 32GB Ram, 2x960GB SSD disks, Non-RAID", "keyName"=>"S1270_32GB_2X960GBSSD_NORAID", "totalMinimumHourlyFee"=>"1.057", "totalMinimumRecurringFee"=>"701"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"S1270_32GB_2X960GBSSD_NORAID"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2650, 64GB Ram, 4x1TB SATA disks, Non-RAID", "keyName"=>"D2650_64GB_4X1TBSATA_NORAID", "totalMinimumHourlyFee"=>"1.148", "totalMinimumRecurringFee"=>"762"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2650_64GB_4X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2650, 128GB Ram, 1x1TB SATA  disks, Non-RAID", "keyName"=>"D2650_128GB_1X1TBSATA_NORAID", "totalMinimumHourlyFee"=>"1.399", "totalMinimumRecurringFee"=>"929"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2650_128GB_1X1TBSATA_NORAID"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2620, 64GB Ram, 4x600GB SAS disks, RAID10", "keyName"=>"D2620_64GB_4X300GBSAS_RAID10", "totalMinimumHourlyFee"=>"1.603", "totalMinimumRecurringFee"=>"1068"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2620_64GB_4X300GBSAS_RAID10"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2690, 128GB Ram, 2x600GB SAS disks, RAID1", "keyName"=>"D2690_128GB_2X600GBSAS_RAID1", "totalMinimumHourlyFee"=>"1.87", "totalMinimumRecurringFee"=>"1246"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2690_128GB_2X600GBSAS_RAID1"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2690, 128GB Ram, 2x600GB SAS disks, RAID1", "keyName"=>"D2690_128GB_2X600GBSAS_RAID1_2", "totalMinimumHourlyFee"=>"1.893", "totalMinimumRecurringFee"=>"1261"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2690_128GB_2X600GBSAS_RAID1_2"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2690, 64GB Ram, 4x960GB SSD disks, RAID10", "keyName"=>"D2690_64GB_4X960GBSSD_RAID10", "totalMinimumHourlyFee"=>"2.226", "totalMinimumRecurringFee"=>"1481"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2690_64GB_4X960GBSSD_RAID10"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2690, 256GB Ram, 4x600GB SAS disks, RAID10", "keyName"=>"D2690_256GB_4X600GBSAS_RAID10_RAID_10", "totalMinimumHourlyFee"=>"2.605", "totalMinimumRecurringFee"=>"1733"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2690_256GB_4X600GBSAS_RAID10_RAID_10"}}},
                   {"preset"=>{"description"=>"Dual Xeon 2650, 128GB Ram, 4x800GB SSD disks, RAID10", "keyName"=>"D2650_128GB_4X800GBSSD_RAID10", "totalMinimumHourlyFee"=>"2.749", "totalMinimumRecurringFee"=>"1828"}, "template"=>{"fixedConfigurationPreset"=>{"keyName"=>"D2650_128GB_4X800GBSSD_RAID10"}}}]
          }
        end
      end

      class Real
        def get_available_preset_codes
          self.request(:hardware_server, :get_create_object_options, :http_method => :GET)
        end
      end
    end
  end
end
