module CartoDB
 class Init

    class << self

      def start(cartodb_settings = nil)
        if cartodb_settings.blank?
          config_path = Rails.root.join('config/cartodb_config.yml')
          cartodb_settings = YAML.load_file(config_path)[Rails.env.to_s] if File.exists?(config_path)
        end

        return if cartodb_settings.blank?

        if CartoDB.const_defined?('Settings')
          CartoDB::Settings.merge!(cartodb_settings)
        else
          CartoDB.const_set('Settings', cartodb_settings)
        end

        CartoDB.const_set('Connection', CartoDB::Client::Connection::Base.new) unless CartoDB.const_defined?('Connection')


      end

    end

  end
end


