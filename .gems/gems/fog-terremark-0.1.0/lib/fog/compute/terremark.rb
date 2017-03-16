module Fog
  module Compute
    class Terremark < Fog::Service
      autoload :Common, File.expand_path("../terremark/common", __FILE__)
      autoload :Parser, File.expand_path("../terremark/parser", __FILE__)
      autoload :Real, File.expand_path("../terremark/real", __FILE__)
      autoload :Mock, File.expand_path("../terremark/mock", __FILE__)

      requires :terremark_vcloud_username, :terremark_vcloud_password

      model_path "fog/compute/terremark/models"
      model       :address
      collection  :addresses
      model       :image
      collection  :images
      model       :internetservice
      collection  :internetservices
      model       :network
      collection  :networks
      model       :nodeservice
      collection  :nodeservices
      model       :server
      collection  :servers
      model       :task
      collection  :tasks
      model       :vdc
      collection  :vdcs

      request_path "fog/compute/terremark/requests"
      request :add_internet_service
      request :add_node_service
      request :configure_vapp
      request :create_internet_service
      request :delete_internet_service
      request :delete_node_service
      request :delete_public_ip
      request :delete_vapp
      request :deploy_vapp
      request :get_catalog
      request :get_catalog_item
      request :get_internet_services
      request :get_keys_list
      request :get_network
      request :get_network_ips
      request :get_node_services
      request :get_organization
      request :get_organizations
      request :get_public_ip
      request :get_public_ips
      request :get_task
      request :get_tasks_list
      request :get_vapp
      request :get_vapp_template
      request :get_vdc
      request :instantiate_vapp_template
      request :power_off
      request :power_on
      request :power_reset
      request :power_shutdown
    end
  end
end