module Fog
  module DNS
    class StormOnDemand < Fog::Service
      autoload :Domain, File.expand_path("../dns/storm_on_demand/models/domain", __FILE__)
      autoload :Domains, File.expand_path("../dns/storm_on_demand/models/domains", __FILE__)
      autoload :Record, File.expand_path("../dns/storm_on_demand/models/record", __FILE__)
      autoload :Records, File.expand_path("../dns/storm_on_demand/models/records", __FILE__)
      autoload :Reverse, File.expand_path("../dns/storm_on_demand/models/reverse", __FILE__)
      autoload :Reverses, File.expand_path("../dns/storm_on_demand/models/reverses", __FILE__)
      autoload :Zone, File.expand_path("../dns/storm_on_demand/models/zone", __FILE__)
      autoload :Zones, File.expand_path("../dns/storm_on_demand/models/zones", __FILE__)

      requires :storm_on_demand_username, :storm_on_demand_password
      recognizes :storm_on_demand_auth_url

      model_path "fog/dns/storm_on_demand/models"
      model       :domain
      collection  :domains
      model       :record
      collection  :records
      model       :reverse
      collection  :reverses
      model       :zone
      collection  :zones

      request_path "fog/dns/storm_on_demand/requests"
      request :list_domains
      request :renew_domain

      request :create_record
      request :delete_record
      request :get_record
      request :list_records
      request :update_record
      request :create_record_region
      request :delete_record_region
      request :update_record_region

      request :delete_reverse
      request :update_reverse

      request :create_zone
      request :check_zone_delegation
      request :delete_zone
      request :get_zone
      request :list_zones
      request :update_zone

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
