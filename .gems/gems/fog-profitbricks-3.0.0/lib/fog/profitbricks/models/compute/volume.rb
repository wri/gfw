require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Volume < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :size
        attribute :image
        attribute :bus
        attribute :type
        attribute :availability_zone,       :aliases => 'availabilityZone'
        attribute :image_password,          :aliases => 'imagePassword'
        attribute :ssh_keys,                :aliases => 'sshKeys'
        attribute :licence_type,            :aliases => 'licenceType'
        attribute :cpu_hot_plug,            :aliases => 'cpuHotPlug'
        attribute :cpu_hot_unplug,          :aliases => 'cpuHotUnplug'
        attribute :ram_hot_plug,            :aliases => 'ramHotPlug'
        attribute :ram_hot_unplug,          :aliases => 'ramHotUnplug'
        attribute :nic_hot_plug,            :aliases => 'nicHotPlug'
        attribute :nic_hot_unplug,          :aliases => 'nicHotUnplug'
        attribute :disc_virtio_hot_plug,    :aliases => 'discVirtioHotPlug'
        attribute :disc_virtio_hot_unplug,  :aliases => 'discVirtioHotUnplug'
        attribute :disc_scsi_hot_plug,      :aliases => 'discScsiHotPlug'
        attribute :disc_scsi_hot_unplug,    :aliases => 'discScsiHotUnplug'
        attribute :device_number,           :aliases => 'deviceNumber'

        # metadata
        attribute :created_date,        :aliases => 'createdDate', :type => :time
        attribute :created_by,          :aliases => 'createdBy'
        attribute :last_modified_date,  :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,    :aliases => 'lastModifiedBy'
        attribute :request_id,          :aliases => 'requestId'
        attribute :state

        attribute :datacenter_id

        attr_accessor :options

        def initialize(attributes = {})
          super
        end

        def save
          requires :datacenter_id, :size, :type

          options = {}
          options[:name]              = name if name
          options[:size]              = size
          options[:bus]               = bus if bus
          options[:image]             = image if image
          options[:type]              = type
          options[:licenceType]       = licence_type if licence_type
          options[:imagePassword]     = image_password if image_password
          options[:sshKeys]           = ssh_keys if ssh_keys
          options[:availabilityZone]  = availability_zone if availability_zone

          data = service.create_volume(datacenter_id, options)
          merge_attributes(flatten(data.body))
          true
        end

        def update
          requires :datacenter_id, :id

          options = {}
          options[:name] = name if name
          options[:size] = size if size

          data = service.update_volume(datacenter_id, id, options)
          merge_attributes(flatten(data.body))
          true
        end

        def delete
          requires :datacenter_id, :id
          service.delete_volume(datacenter_id, id)
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

        def create_snapshot(name, description = '')
          requires :datacenter_id, :id

          options = {}
          options[:name] = name if name
          options[:description] = description if description && description != ''

          service.create_volume_snapshot(datacenter_id, id, options)
          true
        end

        def restore_snapshot(snapshot_id)
          requires :datacenter_id, :id

          options = {}
          options[:snapshot_id] = snapshot_id if snapshot_id

          service.restore_volume_snapshot(datacenter_id, id, options)
          true
        end
      end
    end
  end
end
