module Fog
  module Compute
    class StormOnDemand < Fog::Service
      autoload :Config, File.expand_path("../compute/storm_on_demand/models/config", __FILE__)
      autoload :Configs, File.expand_path("../compute/storm_on_demand/models/configs", __FILE__)
      autoload :Image, File.expand_path("../compute/storm_on_demand/models/image", __FILE__)
      autoload :Images, File.expand_path("../compute/storm_on_demand/models/images", __FILE__)
      autoload :Notification, File.expand_path("../compute/storm_on_demand/models/notification", __FILE__)
      autoload :Notifications, File.expand_path("../compute/storm_on_demand/models/notifications", __FILE__)
      autoload :Product, File.expand_path("../compute/storm_on_demand/models/product", __FILE__)
      autoload :Products, File.expand_path("../compute/storm_on_demand/models/products", __FILE__)
      autoload :Server, File.expand_path("../compute/storm_on_demand/models/server", __FILE__)
      autoload :Servers, File.expand_path("../compute/storm_on_demand/models/servers", __FILE__)
      autoload :Template, File.expand_path("../compute/storm_on_demand/models/template", __FILE__)
      autoload :Templates, File.expand_path("../compute/storm_on_demand/models/templates", __FILE__)

      requires :storm_on_demand_username, :storm_on_demand_password
      recognizes :storm_on_demand_auth_url

      model_path "fog/compute/storm_on_demand/models"
      model       :config
      collection  :configs
      model       :image
      collection  :images
      model       :server
      collection  :servers
      model       :template
      collection  :templates
      model       :product
      collection  :products
      model       :notification
      collection  :notifications

      request_path "fog/compute/storm_on_demand/requests"
      request :clone_server
      request :delete_server
      request :reboot_server
      request :list_servers
      request :get_server
      request :create_server
      request :resize_server
      request :server_history
      request :shutdown_server
      request :start_server
      request :server_status
      request :update_server

      request :list_configs
      request :get_config_details

      request :list_templates
      request :get_template_details
      request :restore_template

      request :list_images
      request :create_image
      request :delete_image
      request :get_image_details
      request :update_image
      request :restore_image

      request :get_product
      request :get_product_code
      request :list_products
      request :get_product_price
      request :get_product_starting_price

      request :list_notifications
      request :current_notifications
      request :get_notification
      request :resolve_notification

      class Mock
        def self.data
          @data ||= Hash.new do |hash, key|
            hash[key] = {
              :last_modified => {
                :images  => {},
                :servers => {}
              },
              :images  => {},
              :servers => {}
            }
          end
        end

        def self.reset
          @data = nil
        end

        def self.reset_data(keys=data.keys)
          for key in [*keys]
            data.delete(key)
          end
        end

        def initialize(options = {})
          @storm_on_demand_username = options[:storm_on_demand_username]
        end

        def data
          self.class.data[@storm_on_demand_username]
        end

        def reset_data
          self.class.data.delete(@storm_on_demand_username)
        end
      end

      class Real
        include Fog::StormOnDemand::Shared
      end
    end
  end
end
