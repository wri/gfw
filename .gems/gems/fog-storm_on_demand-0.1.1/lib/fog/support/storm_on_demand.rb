module Fog
  module Support
    class StormOnDemand < Fog::Service
      autoload :Alert, File.expand_path("../support/storm_on_demand/models/alert", __FILE__)
      autoload :Alerts, File.expand_path("../support/storm_on_demand/models/alerts", __FILE__)
      autoload :Ticket, File.expand_path("../support/storm_on_demand/models/ticket", __FILE__)
      autoload :Tickets, File.expand_path("../support/storm_on_demand/models/tickets", __FILE__)

      requires :storm_on_demand_username, :storm_on_demand_password
      recognizes :storm_on_demand_auth_url

      model_path "fog/support/storm_on_demand/models"
      model       :alert
      collection  :alerts
      model       :ticket
      collection  :tickets

      request_path "fog/support/storm_on_demand/requests"
      request :get_active_alert
      request :add_feedback
      request :add_transaction_feedback
      request :authenticate
      request :close_ticket
      request :create_ticket
      request :get_ticket_details
      request :list_tickets
      request :reply_ticket
      request :list_ticket_types

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
