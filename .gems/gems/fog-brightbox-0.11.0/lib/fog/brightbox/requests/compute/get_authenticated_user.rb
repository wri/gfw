module Fog
  module Compute
    class Brightbox
      class Real
        # Requests details about authenticated user from the API
        #
        # @return [Hash] The JSON response parsed to a Hash
        #
        def get_authenticated_user(options = {})
          wrapped_request("get", "/1.0/user", [200], options)
        end
      end
    end
  end
end
