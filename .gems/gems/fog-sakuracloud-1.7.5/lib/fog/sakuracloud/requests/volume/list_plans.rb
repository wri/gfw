# coding: utf-8

module Fog
  module Volume
    class SakuraCloud
      class Real
        def list_plans(options = {})
          request(
            :headers => {
              'Authorization' => "Basic #{@auth_encode}"
            },
            :method => 'GET',
            :path => "#{Fog::SakuraCloud.build_endpoint(@api_zone)}/product/disk"
          )
        end
      end

      class Mock
        def list_plans(options = {})
          response = Excon::Response.new
          response.status = 200
          response.body = {
            "DiskPlans" =>
            [
              {"Index"=>0,
               "ID"=>4,
               "Name"=>"SSDプラン",
               "Availability"=>"available",
               "Size"=>
               [{"SizeMB"=>20480, "DisplaySize"=>20, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/ssd/20g"},
                {"SizeMB"=>102400, "DisplaySize"=>100, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/ssd/100g"},
                {"SizeMB"=>256000, "DisplaySize"=>250, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/ssd/250g"},
                {"SizeMB"=>512000, "DisplaySize"=>500, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/ssd/500g"}]},
              {"Index"=>1,
               "ID"=>2,
               "Name"=>"標準プラン",
               "Availability"=>"available",
               "Size"=>
               [{"SizeMB"=>40960, "DisplaySize"=>40, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/40g"},
                {"SizeMB"=>61440, "DisplaySize"=>60, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/60g"},
                {"SizeMB"=>81920, "DisplaySize"=>80, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/80g"},
                {"SizeMB"=>102400, "DisplaySize"=>100, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/100g"},
                {"SizeMB"=>256000, "DisplaySize"=>250, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/250g"},
                {"SizeMB"=>512000, "DisplaySize"=>500, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/500g"},
                {"SizeMB"=>768000, "DisplaySize"=>750, "DisplaySuffix"=>"GB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/750g"},
                {"SizeMB"=>1048576, "DisplaySize"=>1, "DisplaySuffix"=>"TB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/1t"},
                {"SizeMB"=>2097152, "DisplaySize"=>2, "DisplaySuffix"=>"TB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/2t"},
                {"SizeMB"=>4194304, "DisplaySize"=>4, "DisplaySuffix"=>"TB", "Availability"=>"available", "ServiceClass"=>"cloud/disk/iscsi/4t"}]}
            ]
          }
          response
        end
      end
    end
  end
end
