require File.expand_path('../request', __FILE__)
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Requests < Fog::Collection
        include Fog::Helpers::ProfitBricks::DataHelper
        model Fog::Compute::ProfitBricks::Request

        def all
          result = service.get_all_requests

          load(result.body['items'].each { |request| flatten(request) })
        end

        def get(request_id)
          request = service.get_request(request_id).body

          Excon::Errors

          new(flatten(request))
        rescue Excon::Errors::NotFound
          nil
        end

        def get_status(request_id)
          request = service.get_request_status(request_id).body

          new(flatten(request))
        end
      end
    end
  end
end
