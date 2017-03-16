module Fog
  module Compute
    class Brightbox
      class Real
        # Get full details of the user.
        #
        # @overload get_user(identifier)
        #   @param [String] identifier Unique reference to identify the resource
        #   @param [Hash] options
        #   @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @overload get_user()
        #   @deprecated Use {Fog::Compute::Brightbox::Real#get_authenticated_user} instead
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#user_get_user
        #
        def get_user(identifier, options = {})
          if identifier.nil? || identifier == ""
            Fog::Logger.deprecation("get_user() without a parameter is deprecated, use get_authenticated_user instead [light_black](#{caller.first})[/]")
            get_authenticated_user
          else
            wrapped_request("get", "/1.0/users/#{identifier}", [200], options)
          end
        end
      end
    end
  end
end
