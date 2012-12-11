module CartoDB
  module Client
    module Connection
      class Base

        attr_reader :active_connection

        def initialize
          raise Exception.new 'CartoDB settings not found' if CartoDB::Settings.nil?

          @active_connection = if cartodb_settings?
            CartoDB::Client::Connection::CartoDBConnection.new(settings)
          elsif postgresql_settings?
            CartoDB::Client::Connection::PostgreSQL.new(settings)
          end
        end

        def method_missing(method, *args, &block)
          if @active_connection.respond_to?(method)
            @active_connection.send(method, *args, &block)
          else
            super
          end
        end

        def settings
          CartoDB::Settings || {}
        end
        private :settings

        def cartodb_settings?
          settings.has_key?('api_key') || (settings.has_key?('oauth_key') && settings.has_key?('oauth_secret'))
        end
        private :cartodb_settings?

        def postgresql_settings?
          settings.has_key?('host') && settings.has_key?('user') && settings.has_key?('password') && settings.has_key?('database')
        end
        private :postgresql_settings?

      end
    end
  end
end
