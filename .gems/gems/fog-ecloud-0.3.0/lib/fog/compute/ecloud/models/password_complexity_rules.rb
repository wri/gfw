require File.expand_path("../password_complexity_rule", __FILE__)

module Fog
  module Compute
    class Ecloud
      class PasswordComplexityRules < Fog::Ecloud::Collection
        identity :href

        model Fog::Compute::Ecloud::PasswordComplexityRule

        def all
          data = service.get_password_complexity_rules(href).body
          load(data)
        end

        def get(uri)
          if data = service.get_password_complexity_rule(uri)
            new(data.body)
          end
        rescue ServiceError => e
          raise e unless e.status_code == 404
          nil
        end
      end
    end
  end
end
