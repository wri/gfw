#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/softlayer/models/account/brand'

module Fog
  module Account
    class Softlayer
      class Brands < Fog::Collection
        model Fog::Account::Softlayer::Brand

        def all
          data = service.get_account_owned_brands
          load(data)
        end

        def get(identifier)
          return nil if identifier.nil? || identifier == ""
          data = service.get_brand(identifier).body
          new.merge_attributes(data)
        rescue Excon::Errors::NotFound
          nil
        end
      end
    end
  end
end
