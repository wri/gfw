require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Datacenter < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :description
        attribute :location
        attribute :version
        attribute :features

        # metadata
        attribute :created_date,        :aliases => 'createdDate', :type => :time
        attribute :created_by,          :aliases => 'createdBy'
        attribute :last_modified_date,  :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,    :aliases => 'lastModifiedBy'
        attribute :request_id,          :aliases => 'requestId'
        attribute :state

        attr_accessor :options

        def initialize(attributes = {})
          super
        end

        def save
          requires :name, :location

          options = {}
          options[:name]        = name
          options[:location]    = location
          options[:description] = description if description

          data = service.create_datacenter(options)
          merge_attributes(flatten(data.body))
          true
        end

        def update
          requires :id

          options = {}
          options[:name] = name if name
          options[:description] = description if description
          data = service.update_datacenter(id, options)
          merge_attributes(flatten(data.body))
          true
        end

        def delete
          requires :id
          data = service.delete_datacenter(id)
          true
        end
      end
    end
  end
end
