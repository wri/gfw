require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class FirewallRule < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :protocol
        attribute :source_mac, :aliases => 'sourceMac'
        attribute :source_ip, 	     :aliases => 'sourceIp'
        attribute :target_ip, 	     :aliases => 'targetIp'
        attribute :icmp_code, 	     :aliases => 'icmpCode'
        attribute :icmp_type, 	     :aliases => 'icmpType'
        attribute :port_range_start, :aliases => 'portRangeStart'
        attribute :port_range_end,   :aliases => 'portRangeEnd'

        # metadata
        attribute :created_date,       :aliases => 'createdDate', :type => :time
        attribute :created_by,         :aliases => 'createdBy'
        attribute :last_modified_date, :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,   :aliases => 'lastModifiedBy'
        attribute :request_id,         :aliases => 'requestId'
        attribute :state

        attribute :datacenter_id
        attribute :server_id
        attribute :nic_id

        def save
          requires :datacenter_id, :server_id, :nic_id, :protocol

          properties = {}
          properties[:name]           = name if name
          properties[:protocol]       = protocol if protocol
          properties[:sourceMac]      = source_mac if source_mac
          properties[:sourceIp]       = source_ip if source_ip
          properties[:targetIp]       = target_ip if target_ip
          properties[:portRangeStart] = port_range_start if port_range_start
          properties[:portRangeEnd]   = port_range_end if port_range_end
          properties[:icmpType]       = icmp_type if icmp_type
          properties[:icmpCode]       = icmp_code if icmp_code

          data = service.create_firewall_rule(datacenter_id, server_id, nic_id, properties)
          merge_attributes(flatten(data.body))
        end

        def update
          requires :datacenter_id, :server_id, :nic_id, :id

          properties = {}
          properties[:name]           = name if name
          properties[:sourceMac]      = source_mac if source_mac
          properties[:sourceIp]       = source_ip if source_ip
          properties[:targetIp]       = target_ip if target_ip
          properties[:portRangeStart] = port_range_start if port_range_start
          properties[:portRangeEnd]   = port_range_end if port_range_end
          properties[:icmpType]       = icmp_type if icmp_type
          properties[:icmpCode]       = icmp_code if icmp_code

          data = service.update_firewall_rule(datacenter_id, server_id, nic_id, id, properties)
          merge_attributes(flatten(data.body))
        end

        def delete
          requires :datacenter_id, :server_id, :nic_id, :id
          service.delete_firewall_rule(datacenter_id, server_id, nic_id, id)
          true
        end

        def reload
          requires :datacenter_id, :server_id, :nic_id, :id

          data = begin
            collection.get(datacenter_id, server_id, nic_id, id)
          rescue Excon::Errors::SocketError
            nil
          end

          return unless data

          new_attributes = data.attributes
          merge_attributes(new_attributes)
          self
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
