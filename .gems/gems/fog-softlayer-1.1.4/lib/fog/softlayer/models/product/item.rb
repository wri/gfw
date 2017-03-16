#
# Author:: Celso Fernandes (<fernandes@zertico.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Softlayer
    class Product

      class Item < Fog::Model

        # A product's internal identification number
        identity  :id,                           :type => :integer

        # Some Product Items have capacity information such as RAM and bandwidth, and others. This provides the numerical representation of the capacity given in the description of this product item.
        attribute :capacity,                     :type => :float

        # A product's description
        attribute :description,                  :type => :string

        # A products tax category internal identification number
        attribute :item_tax_category_id,         :aliases => 'itemTaxCategoryId', :type => :integer

        # A unique key name for the product.
        attribute :key_name,                     :aliases => 'keyName', :type => :string

        # Detailed product description
        attribute :long_description,             :aliases => 'longDescription', :type => :string

        # The unique identifier of the SoftLayer_Software_Description tied to this item.
        attribute :software_description_id,      :aliases => 'softwareDescriptionId', :type => :integer

        # The unit of measurement that a product item is measured in.
        attribute :units,                        :aliases => 'units', :type => :string

        # A products upgrade item's internal identification number
        attribute :upgrade_item_id,              :aliases => 'upgradeItemId', :type => :integer

        def initialize(attributes = {})
          super(attributes)
        end
      end
    end
  end
end
