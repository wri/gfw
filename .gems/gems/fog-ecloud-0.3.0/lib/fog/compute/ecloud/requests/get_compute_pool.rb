module Fog
  module Compute
    class Ecloud
      class Real
        basic_request :get_compute_pool
      end

      class Mock
        def get_compute_pool(uri)
          compute_pool_id = id_from_uri(uri)
          compute_pool = data[:compute_pools][compute_pool_id]

          if compute_pool
            response(:body => Fog::Ecloud.slice(compute_pool, :id, :environment))
          else
            body = "<Error message=\"Resource Not Found\" majorErrorCode=\"404\" minorErrorCode=\"ResourceNotFound\" />"
            response(:body => body, :expects => 200, :status => 404)
          end
        end
      end
    end
  end
end
