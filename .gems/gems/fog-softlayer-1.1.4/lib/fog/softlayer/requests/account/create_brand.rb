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
        # Create a Brand
        # @param [Hash] attributes
        # @return [Excon::Response]
        def create_brand(attributes)
          raise ArgumentError, "Fog::Account::Softlayer#create_brand expects argument of type Hash" unless attributes.kind_of?(Hash)
          response = Excon::Response.new
          required = %w{keyName longName name account}
          if Fog::Softlayer.valid_request?(required, attributes)
            response.status = 201
            response.body = { :id => Fog::Softlayer.mock_vm_id.to_i, :catalogId => 14 }.merge(attributes)
            @brands << response.body
          else
            response.status = 500
            response.body = {
              "code" => "SoftLayer_Exception_MissingCreationProperty",
              "error" => "Properties #{required.join(', ')} ALL must be set to create an instance of 'SoftLayer_Brand'."
            }
          end
          response
        end
      end

      class Real
        def create_brand(attributes)
          request(:brand, :create_object, :body => attributes, :http_method => :POST)
        end
      end
    end
  end
end
