#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Softlayer
    class Product

      class Packages < Fog::Collection

        model Fog::Softlayer::Product::Package
        
        def initialize(attributes = {})
          super(attributes)
        end
        
        def all
          data = service.get_packages.body
          load(data)
        end
      end
    end
  end
end
