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
        # Get all brands who are owned by account.
        # @param [Integer] identifier
        # @return [Excon::Response]
        def get_account_owned_brands(identifier)
          response = Excon::Response.new
          response.status = 200
          response.body = mocked_brands
          if @accounts.select {|account| account['id'] == identifier.to_i }.empty?
            response.status = 404
            response.body = {
              "error" => "Unable to find object with id of '#{identifier}'.",
              "code"=>"SoftLayer_Exception_ObjectNotFound"
            }
          end
          response
        end
      end

      class Real
        def get_account_owned_brands(identifier)
          return request(:account, :getOwnedBrands) if identifier.nil?
          request(:account, "#{identifier}/getOwnedBrands")
        end
      end
    end
  end
end

module Fog
  module Account
    class Softlayer
      class Mock
        def mocked_brands
          [
            {
              "catalogId"=>14,
              "id"=>11111,
              "keyName"=>"NAME",
              "longName"=>"Name Name",
              "name"=>"Name"
            }
          ]
        end
      end
    end
  end
end
