#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Softlayer
    class Product

      class Items < Fog::Collection

        attribute :package_id,                     :type => :integer
        
        model Fog::Softlayer::Product::Item
        
        def initialize(attributes = {})
          super(attributes)
        end
        
        def all
          requires :package_id
          data = service.get_package_items(package_id).body
          load(data)
        end
        
        def get(identifier)
          requires :package_id
          return nil if identifier.nil? || identifier == ""
          data = service.get_package_item(package_id, identifier).body.first
          new.merge_attributes(data)
        rescue Excon::Errors::NotFound
          nil
        end
      end
    end
  end
end
