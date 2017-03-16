require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class IpBlock < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :ips
        attribute :location
        attribute :size
        attribute :name

        # metadata
        attribute :created_date,       :aliases => 'createdDate', :type => :time
        attribute :created_by, 	       :aliases => 'createdBy'
        attribute :last_modified_date, :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,   :aliases => 'lastModifiedBy'
        attribute :request_id,         :aliases => 'requestId'
        attribute :state

        def initialize(attributes = {})
          super
        end

        def save
          requires :location, :size

          properties = {}
          properties[:location] = location if location
          properties[:size]     = size if size
          properties[:name]     = name if name

          data = service.create_ip_block(properties)
          merge_attributes(flatten(data.body))
          true
        end

        def delete
          requires :id
          service.delete_ip_block(id)
          true
        end

        def ready?
          state == 'AVAILABLE'
        end

        def failed?
          state == 'ERROR'
        end
      end
    end
  end
end
