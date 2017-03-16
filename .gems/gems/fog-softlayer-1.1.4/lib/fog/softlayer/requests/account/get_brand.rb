#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Account
    class Softlayer
      class Mock
        # Get a Brand
        # @param [Integer] identifier
        # @return [Excon::Response]
        def get_brand(identifier)
          response = Excon::Response.new
          response.body = @brands.select {|brand| brand[:id] == identifier.to_i }.first || {}
          response.status = response.body.empty? ? 404 : 200
          if response.status == 404
            response.body = {
              "error" => "Unable to find object with id of '#{identifier}'.",
              "code"=>"SoftLayer_Exception_ObjectNotFound"
            }
          end
          response
        end
      end

      class Real
        def get_brand(identifier)
          request(:brand, identifier, :expected => [200, 404], :query => 'objectMask=mask[account]')
        end
      end
    end
  end
end
