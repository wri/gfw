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
        def create_subnet(order)
          raise ArgumentError, "Order argument for #{self.class.name}##{__method__} must be Hash." unless order.is_a?(Hash)
          # TODO: more than a stub
        end
      end

      class Real
        def create_subnet(order)
          raise ArgumentError, "Order argument for #{self.class.name}##{__method__} must be Hash." unless order.is_a?(Hash)
          self.request(:product_order, :place_order, :body => order, :http_method => :post)
        end
      end
    end
  end
end
