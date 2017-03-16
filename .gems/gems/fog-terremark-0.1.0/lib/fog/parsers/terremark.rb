module Fog
  module Parsers
    module Terremark
      autoload :Base, File.expand_path("../terremark/base", __FILE__)
      autoload :GetCatalog, File.expand_path("../terremark/get_catalog", __FILE__)
      autoload :GetCatalogItem, File.expand_path("../terremark/get_catalog_item", __FILE__)
      autoload :GetInternetServices, File.expand_path("../terremark/get_internet_services", __FILE__)
      autoload :GetKeysList, File.expand_path("../terremark/get_keys_list", __FILE__)
      autoload :GetNetworkIps, File.expand_path("../terremark/get_network_ips", __FILE__)
      autoload :GetNodeServices, File.expand_path("../terremark/get_node_services", __FILE__)
      autoload :GetOrganization, File.expand_path("../terremark/get_organization", __FILE__)
      autoload :GetOrganizations, File.expand_path("../terremark/get_organizations", __FILE__)
      autoload :GetPublicIps, File.expand_path("../terremark/get_public_ips", __FILE__)
      autoload :GetTasksList, File.expand_path("../terremark/get_tasks_list", __FILE__)
      autoload :GetVappTemplate, File.expand_path("../terremark/get_vapp_template", __FILE__)
      autoload :GetVdc, File.expand_path("../terremark/get_vdc", __FILE__)
      autoload :InstantiateVappTemplate, File.expand_path("../terremark/instantiate_vapp_template", __FILE__)
      autoload :InternetService, File.expand_path("../terremark/internet_service", __FILE__)
      autoload :Network, File.expand_path("../terremark/network", __FILE__)
      autoload :NodeService, File.expand_path("../terremark/node_service", __FILE__)
      autoload :PublicIp, File.expand_path("../terremark/public_ip", __FILE__)
      autoload :Task, File.expand_path("../terremark/task", __FILE__)
      autoload :Vapp, File.expand_path("../terremark/vapp", __FILE__)
    end
  end
end
