#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Softlayer
    class Product

      class Package < Fog::Model

        # A package's internal identifier. Everything regarding a SoftLayer_Product_Package is tied back to this id.
        identity  :id,                           :type => :integer
        
        # A generic description of the processor type and count. This includes HTML, so you may want to strip these tags if you plan to use it.
        attribute :description,         :aliases => 'description', :type => :string

        # This is only needed for step-based order verification. We use this for the order forms, but it is not required. This step is the first SoftLayer_Product_Package_Step for this package. Use this for for filtering which item categories are returned as a part of SoftLayer_Product_Package_Order_Configuration.
        attribute :first_order_step_id,         :aliases => 'firstOrderStepId', :type => :integer

        # If package is active or not
        attribute :is_active,         :aliases => 'isActive', :type => :integer

        # The description of the package. For server packages, this is usually a detailed description of processor type and count.
        attribute :name,         :aliases => 'name', :type => :string

        # This currently contains no information but is here for future use.
        attribute :sub_description,         :aliases => 'subDescription', :type => :string

        # The server unit size this package will match to.
        attribute :unit_size,         :aliases => 'unitSize', :type => :integer

        def initialize(attributes = {})
          super(attributes)
        end
        
        def items
          Fog::Softlayer::Product::Items.new(:service => service, package_id: id).all
        end
      end
    end
  end
end
