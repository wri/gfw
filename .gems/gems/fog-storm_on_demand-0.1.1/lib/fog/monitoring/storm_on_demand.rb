module Fog
  module Monitoring
    class StormOnDemand < Fog::Service
      autoload :Bandwidth, File.expand_path("../monitoring/storm_on_demand/models/bandwidth", __FILE__)
      autoload :Bandwidths, File.expand_path("../monitoring/storm_on_demand/models/bandwidths", __FILE__)
      autoload :Load, File.expand_path("../monitoring/storm_on_demand/models/load", __FILE__)
      autoload :Loads, File.expand_path("../monitoring/storm_on_demand/models/loads", __FILE__)
      autoload :MonitorService, File.expand_path("../monitoring/storm_on_demand/models/monitor_service", __FILE__)
      autoload :MonitorServices, File.expand_path("../monitoring/storm_on_demand/models/monitor_services", __FILE__)

      requires :storm_on_demand_username, :storm_on_demand_password
      recognizes :storm_on_demand_auth_url

      model_path "fog/monitoring/storm_on_demand/models"
      model       :load
      collection  :loads
      model       :bandwidth
      collection  :bandwidths
      model       :monitor_service
      collection  :monitor_services

      request_path "fog/monitoring/storm_on_demand/requests"
      request :get_load_graph
      request :get_load_stats
      request :get_bandwidth_graph
      request :get_bandwidth_stats
      request :get_service
      request :monitoring_ips
      request :get_service_status
      request :update_service

      class Mock
        def self.data
          @data ||= Hash.new
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
