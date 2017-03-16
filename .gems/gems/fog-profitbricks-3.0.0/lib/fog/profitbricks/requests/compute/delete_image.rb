module Fog
  module Compute
    class ProfitBricks
      class Real
        # Delete an existing image
        #
        # ==== Parameters
        # * image_id<~String>               - UUID of the image resource
        #
        # ==== Returns
        # * response<~Excon::Response> - No response parameters
        #   (HTTP/1.1 202 Accepted)
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#delete-image]
        def delete_image(image_id)
          request(
            :expects => [202],
            :method  => 'DELETE',
            :path    => "/images/#{image_id}"
          )
        end
      end

      class Mock
        def delete_image(image_id)
          response = Excon::Response.new
          response.status = 202

          if img = data[:images]["items"].find do |image|
            image["id"] == image_id
          end
          else
            raise Fog::Errors::NotFound, "The requested resource could not be found"
          end

          response
        end
      end
    end
  end
end
