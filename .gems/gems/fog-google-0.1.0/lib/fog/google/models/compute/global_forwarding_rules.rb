require 'fog/core/collection'
require 'fog/google/models/compute/global_forwarding_rule'

module Fog
  module Compute
    class Google
      class GlobalForwardingRules < Fog::Collection
        model Fog::Compute::Google::GlobalForwardingRule

        def all
          data = service.list_global_forwarding_rules.body['items'] || []
          load(data)
        end

        def get(identity, region='global')
          if global_forwarding_rule = service.get_global_forwarding_rule(identity, region).body
            new(global_forwarding_rule)
          end
        rescue Fog::Errors::NotFound
          nil
        end
      end
    end
  end
end
