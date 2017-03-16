# require "fog/compute/models/server"
require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Server < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :cores
        attribute :ram
        attribute :availability_zone, :aliases => 'availabilityZone'
        attribute :vm_state,          :aliases => 'vmState'
        attribute :boot_cdrom,        :aliases => 'bootCdrom'
        attribute :boot_volume,       :aliases => 'bootVolume'
        attribute :cpu_family,        :aliases => 'cpuFamily'
        attribute :allow_reboot,      :aliases => 'allowReboot'

        # metadata
        attribute :created_date,       :aliases => 'createdDate', :type => :time
        attribute :created_by,         :aliases => 'createdBy'
        attribute :last_modified_date, :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,   :aliases => 'lastModifiedBy'
        attribute :request_id,         :aliases => 'requestId'
        attribute :state

        # entities
        # attribute :cdroms
        attribute :volumes
        attribute :nics

        attribute :datacenter_id

        attr_accessor :options

        def initialize(attributes = {})
          super
        end

        def save
          requires :datacenter_id, :name, :cores, :ram

          properties = {}
          properties[:name]             = name if name
          properties[:cores]            = cores if cores
          properties[:ram]              = ram if ram
          properties[:availabilityZone] = availability_zone if availability_zone
          properties[:bootVolume]       = boot_volume if boot_volume
          properties[:bootCdrom]        = boot_cdrom if boot_cdrom
          properties[:cpuFamily]        = cpu_family if cpu_family

          entities = {}
          entities[:volumes] = get_volumes(volumes) if volumes

          entities[:nics] = get_nics(nics) if nics

          data = service.create_server(datacenter_id, properties, entities)
          merge_attributes(flatten(data.body))
          true
        end

        def update
          requires :datacenter_id, :id

          properties = {}
          properties[:name]             = name if name
          properties[:cores]            = cores if cores
          properties[:ram]              = ram if ram
          properties[:availabilityZone] = availability_zone if availability_zone
          properties[:cpuFamily]        = cpu_family if cpu_family
          properties[:allowReboot]      = allow_reboot if allow_reboot

          data = service.update_server(datacenter_id, id, properties)
          merge_attributes(flatten(data.body))
          true
        end

        def attach_volume(storage_id)
          requires :datacenter_id, :id

          data = service.attach_volume(datacenter_id, id, storage_id)
          flatten(data.body)
        end

        def get_attached_volume(volume_id)
          requires :datacenter_id, :id

          data = service.get_attached_volume(datacenter_id, id, volume_id)
          volume = data.body
          volume['datacenter_id'] = datacenter_id
          flatten(data.body)
        end

        def detach_volume(storage_id)
          requires :datacenter_id, :id

          service.detach_volume(datacenter_id, id, storage_id)
          true
        end

        def attach_cdrom(cdrom_image_id)
          requires :datacenter_id, :id

          data = service.attach_cdrom(datacenter_id, id, cdrom_image_id)

          flatten(data.body)
        end

        def get_attached_cdrom(cdrom_image_id)
          requires :datacenter_id, :id

          data = service.get_attached_cdrom(datacenter_id, id, cdrom_image_id)
          flatten(data.body)
        end

        def detach_cdrom(cdrom_id)
          requires :datacenter_id, :id

          service.detach_cdrom(datacenter_id, id, cdrom_id)
          true
        end

        def reboot
          requires :datacenter_id, :id
          service.reboot_server(datacenter_id, id)
          true
        end

        def start
          requires :datacenter_id, :id
          service.start_server(datacenter_id, id)
          true
        end

        def stop
          requires :datacenter_id, :id
          service.stop_server(datacenter_id, id)
          true
        end

        def delete
          requires :datacenter_id, :id
          service.delete_server(datacenter_id, id)
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

        def list_volumes
          requires :datacenter_id, :id

          result = service.list_attached_volumes(datacenter_id, id)

          volumes = result.body['items'].each { |volume| volume['datacenter_id'] = datacenter_id }
          result.body['items'] = volumes

          result.body
        end

        def list_cdroms
          requires :datacenter_id, :id

          result = service.list_attached_cdroms(datacenter_id, id)

          cdroms = result.body['items'].each { |cdrom| cdrom['datacenter_id'] = datacenter_id }
          result.body['items'] = cdroms

          result.body
        end

        def list_nics
          requires :datacenter_id, :id
          service.nics.all(datacenter_id, id)
        end

        def shutoff?
          vm_state == 'SHUTOFF'
        end

        def running?
          vm_state == 'RUNNING'
        end

        private

        def get_volumes(volumes)
          items = []
          for volume in volumes do
            item = {}
            item[:name] = volume[:name]
            item[:size] = volume[:size]
            item[:type] = volume[:type]
            item[:bus] = volume[:bus] || 'VIRTIO'
            item[:image] = volume[:image]
            item[:imagePassword] = volume[:image_password]
            item[:sshKeys] = volume[:ssh_keys]
            item[:licenceType] = volume[:licence_type]
            items << { :properties => item }
          end
          { :items => items }
        end

        def get_nics(nics)
          items = []
          for nic in nics do
            firewall_rules = nil
            item = {}
            item[:name]           = nic[:name] if nic.key?(:name)
            item[:ips]            = nic[:ips] if nic.key?(:ips)
            item[:dhcp]           = nic[:dhcp] if nic.key?(:dhcp)
            item[:lan]            = nic[:lan] if nic.key?(:lan)
            item[:firewallActive] = nic[:firewall_active] if nic.key?(:firewall_active)
            if nic[:firewall_rules]
              firewall_rules = get_firewall_rules(nic[:firewall_rules])
              item[:firewallActive] = true
            end
            items << { :properties => item, :entities => firewall_rules }
          end
          { :items => items }
        end

        def get_firewall_rules(firewall_rules)
          items = []
          for firewall_rule in firewall_rules do
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
          { :firewallrules => { :items => items } }
        end
      end
    end
  end
end
