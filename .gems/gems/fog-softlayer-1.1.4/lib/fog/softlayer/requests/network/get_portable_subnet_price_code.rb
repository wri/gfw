#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Network
    class Softlayer

      class Mock

        def get_portable_subnet_price_code(address_count, public=true)
          42
        end

      end

      class Real
        def get_portable_subnet_price_code(address_count, public=true)
          portable_subnet_package_id = get_portable_subnet_package_id(public ? 'PUBLIC' : 'PRIVATE')
          request(:product_package, '0/get_item_prices', :query => 'objectMask=mask[id,categories.id,item.description]').body.map do |item|
            catg = item['categories'][0]
            item['id'] if catg['id'] == portable_subnet_package_id && item['item']['description'] =~ /^#{address_count}/
          end.compact.first
        end
      end
    end
  end
end
