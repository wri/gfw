module Fog
  module Compute
    class Ecloud
      class Real
        basic_request :get_template
      end

      class Mock
        def get_template(uri)
          template_id, _compute_pool_id = uri.match(/(\d+).*\/(\d+)$/).captures
          template = data[:templates][template_id.to_i]

          if template
            response(:body => Fog::Ecloud.slice(template, :id, :environment))
          else
            body = "<Error message=\"Resource Not Found\" majorErrorCode=\"404\" minorErrorCode=\"ResourceNotFound\" />"
            response(:body => body, :expects => 200, :status => 404)
          end
        end
      end
    end
  end
end
