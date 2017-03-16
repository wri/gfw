#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Account
    class Softlayer
      class Brand < Fog::Model
        identity  :id, :type => :integer
        attribute :catalog_id, :aliases => 'catalogId', :type => :integer
        attribute :key_name, :aliases => 'keyName'
        attribute :long_name, :aliases => 'longName'
        attribute :name
        attribute :account

        def initialize(attributes = {})
          super(attributes)
        end

        def get_accounts
          service.get_brand_owned_accounts(id).body
        end

        def save
          return create if attributes[:id].nil?
          raise StandardError, "Update is not implemented"
        end

        def create
          template = create_template
          service.create_brand(template).body
        end

        private

        def create_template
          {
            keyName: attributes[:key_name],
            longName: attributes[:long_name],
            name: attributes[:name],
            account: attributes[:account]
          }
        end
      end
    end
  end
end
