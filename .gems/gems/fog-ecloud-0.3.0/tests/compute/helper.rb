def compute_providers
  {
    :ecloud => {
      :server_attributes => {
        :name                 => "VM4",
        :row                  => "Layout Row 1",
        :group                => "Layout Group 1",
        :catalog_network_name => "bridged",
        :description          => "blarg",
        :operating_system => {
          :name =>  "Red Hat Enterprise Linux 5 (64-bit)",
          :href => "/cloudapi/ecloud/operatingsystems/rhel5_64guest/computepools/963",
        },
        :organization_uri => 'organizations/9284920'
      }.tap do |hash|
        [:template_href, :network_uri,
         :environment_name, :organization_uri].each do |k|
          key = "ecloud_#{k}".to_sym
          if Fog.credentials[key]
            hash[k]= Fog.credentials[key]
          end
        end
      end,
      :mocked => true,
    }
  }
end
