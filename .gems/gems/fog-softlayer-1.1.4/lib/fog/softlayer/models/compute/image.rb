#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Fog
  module Compute
    class Softlayer

      class Image < Fog::Model

        identity :id,               :aliases => 'globalIdentifier'
        attribute :name
        attribute :note
        attribute :parent_id,       :aliases => 'parentId'
        attribute :public_flag,      :aliases => 'publicFlag'
        attribute :status_id,       :aliases => 'statusId'
        attribute :summary
        attribute :transaction_id,  :aliases => 'transactionId'
        attribute :user_record_id,  :aliases => 'userRecordId'
        attribute :account_id,  :aliases => 'accountId'

        def public?
          public_flag == 1
        end

      end

    end
  end
end
