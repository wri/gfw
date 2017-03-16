module Fog
  module Compute
    class Brightbox
      class Real
        # Lists summary details of images available for use by the Account. It includes those available to all customers
        #
        # @param [Hash] options
        # @option options [Boolean] :nested passed through with the API request. When true nested resources are expanded.
        #
        # @return [Hash] if successful Hash version of JSON object
        #
        # @see https://api.gb1.brightbox.com/1.0/#image_list_images
        #
        def list_images(options = {})
          wrapped_request("get", "/1.0/images", [200], options)
        end
      end
    end
  end
end
