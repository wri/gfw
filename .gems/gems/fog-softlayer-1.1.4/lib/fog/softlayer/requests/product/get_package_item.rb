#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Softlayer
    class Product

      class Mock
        def get_package_item(package_id, id)
          response = Excon::Response.new
          
          # get item with specified id from fixtures
          items = fixtures_package_items(package_id)
          item_found = nil
          items.each { |item| item_found = item if item["id"] == id }
          
          response.body = [item_found]
          response.status = 200
          return response
        end

      end

      class Real
        def get_package_item(package_id, id)
          request(
            :product_package,
            package_id.to_s + '/getItems',
            query: 'queryEngineVersion=2&objectFilter={"items":{"id":{"operation":'+id.to_s+'}}}'
          )
        end
      end
    end
  end
end
