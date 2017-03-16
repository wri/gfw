module Fog
  module Helpers
    module ProfitBricks
      module DataHelper
        def flatten(response_json)
          %w(properties metadata entities).each { |k| response_json.merge!(response_json.delete(k)) if response_json.key?(k) }
          response_json
        end
      end
    end
  end
end
