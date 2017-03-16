require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class LoadBalancer < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :ip
        attribute :dhcp

        # metadata
        attribute :created_date,        :aliases => 'createdDate', :type => :time
        attribute :created_by, 	        :aliases => 'createdBy'
        attribute :last_modified_date,  :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,    :aliases => 'lastModifiedBy'
        attribute :state

        # entities
        attribute :balancednics

        attribute :datacenter_id

        def initialize(attributes = {})
          super
        end

        def save
          requires :datacenter_id, :name

          properties = {}
          properties[:name]       = name if name
          properties[:ip]         = ip if ip
          properties[:dhcp]       = dhcp if dhcp

          entities = {}
          entities[:balancednics] = balancednics if balancednics

          data = service.create_load_balancer(datacenter_id, properties, entities)
          merge_attributes(flatten(data.body))
          true
        end

        def update
          requires :datacenter_id, :id

          properties = {}
          properties[:name]       = name if name
          properties[:ip]         = ip if ip
          properties[:dhcp]       = dhcp if dhcp

          data = service.update_load_balancer(datacenter_id, id, properties)
          merge_attributes(data.body)
          true
        end

        def delete
          requires :datacenter_id, :id
          service.delete_load_balancer(datacenter_id, id)
          true
        end

        def reload
          requires :datacenter_id, :id

          data = begin
            collection.get(datacenter_id, id)
          rescue Excon::Errors::SocketError
            nil
          end

          return unless data

          new_attributes = data.attributes
          merge_attributes(new_attributes)
          self
        end

        def list_nics
          requires :datacenter_id, :id

          response = service.get_all_load_balanced_nics(datacenter_id, id)

          response.body['items'].each { |load_balanced_nic| flatten(load_balanced_nic) }
        end

        def get_nic(nic_id)
          requires :datacenter_id, :id

          response = service.get_load_balanced_nic(datacenter_id, id, nic_id)

          flatten(response.body)
        end

        def associate_nic(nic_id)
          requires :datacenter_id, :id

          response = service.associate_nic_to_load_balancer(datacenter_id, id, nic_id)

          flatten(response.body)
        end

        def remove_nic_association(nic_id)
          requires :datacenter_id, :id

          service.remove_nic_association(datacenter_id, id, nic_id)

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
