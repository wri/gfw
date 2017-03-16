require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Nic < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :mac
        attribute :ips
        attribute :dhcp
        attribute :lan
        attribute :nat
        attribute :firewall_active, :aliases => 'firewallActive'

        # metadata
        attribute :created_date,       :aliases => 'createdDate', :type => :time
        attribute :created_by, 	       :aliases => 'createdBy'
        attribute :last_modified_date, :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,   :aliases => 'lastModifiedBy'
        attribute :request_id,         :aliases => 'requestId'
        attribute :state

        # entities
        attribute :firewallrules
        attribute :firewall_rules

        attribute :datacenter_id
        attribute :server_id

        attr_accessor :options

        def save
          requires :datacenter_id, :server_id, :lan

          properties = {}
          properties[:name]           = name if name
          properties[:ips]            = ips if ips
          properties[:dhcp]           = dhcp if dhcp
          properties[:lan]            = lan if lan
          properties[:nat]            = nat if nat
          properties[:firewallActive] = firewall_active if firewall_active

          entities = {}
          if firewall_rules
            properties[:firewallActive] = true
            entities[:firewallrules] = get_firewall_rules(firewall_rules)
          end

          data = service.create_nic(datacenter_id, server_id, properties, entities)
          merge_attributes(flatten(data.body))
        end

        def update
          requires :datacenter_id, :server_id, :id

          properties = {}
          properties[:name] = name if name
          properties[:ips]  = ips if ips
          properties[:dhcp] = dhcp if dhcp
          properties[:lan]  = lan if lan
          properties[:nat]  = nat if nat

          data = service.update_nic(datacenter_id, server_id, id, properties)
          merge_attributes(data.body)
        end

        def delete
          requires :datacenter_id, :server_id, :id
          service.delete_nic(datacenter_id, server_id, id)
          true
        end

        def reload
          requires :datacenter_id, :server_id, :id

          data = begin
            collection.get(datacenter_id, server_id, id)
          rescue Excon::Errors::SocketError
            nil
          end

          return unless data

          new_attributes = data.attributes
          merge_attributes(new_attributes)
          self
        end

        def get_firewall_rules(firewall_rules)
          items = []
          firewall_rules.each do |firewall_rule|
            item = {}
            item[:name]           = firewall_rule[:name] if firewall_rule.key?(:name)
            item[:protocol]       = firewall_rule[:protocol] if firewall_rule.key?(:protocol)
            item[:sourceMac]      = firewall_rule[:source_mac] if firewall_rule.key?(:source_mac)
            item[:sourceIp]       = firewall_rule[:source_ip] if firewall_rule.key?(:source_ip)
            item[:targetIp]       = firewall_rule[:target_ip] if firewall_rule.key?(:target_ip)
            item[:portRangeStart] = firewall_rule[:port_range_start] if firewall_rule.key?(:port_range_start)
            item[:portRangeEnd]   = firewall_rule[:port_range_end] if firewall_rule.key?(:port_range_end)
            item[:icmpType]       = firewall_rule[:icmp_type] if firewall_rule.key?(:icmp_type)
            item[:icmpCode]       = firewall_rule[:icmp_code] if firewall_rule.key?(:icmp_code)
            items << { :properties => item }
          end
          { :items => items }
        end
      end
    end
  end
end
