require File.expand_path('../../../helpers/compute/data_helper', __FILE__)

module Fog
  module Compute
    class ProfitBricks
      class Image < Fog::Models::ProfitBricks::Base
        include Fog::Helpers::ProfitBricks::DataHelper

        identity  :id

        # properties
        attribute :name
        attribute :description
        attribute :location
        attribute :size
        attribute :cpu_hot_plug,           :aliases => 'cpuHotPlug'
        attribute :cpu_hot_unplug,         :aliases => 'cpuHotUnplug'
        attribute :ram_hot_plug,           :aliases => 'ramHotPlug'
        attribute :ram_hot_unplug,         :aliases => 'ramHotUnplug'
        attribute :nic_hot_plug,           :aliases => 'nicHotPlug'
        attribute :nic_hot_unplug,         :aliases => 'nicHotUnplug'
        attribute :disc_virtio_hot_plug,   :aliases => 'discVirtioHotPlug'
        attribute :disc_virtio_hot_unplug, :aliases => 'discVirtioHotUnplug'
        attribute :disc_scsi_hot_plug, 	   :aliases => 'discScsiHotPlug'
        attribute :disc_scsi_hot_unplug,   :aliases => 'discScsiHotUnplug'
        attribute :licence_type,           :aliases => 'licenceType'
        attribute :image_type,             :aliases => 'imageType'
        attribute :public

        # metadata
        attribute :created_date,       :aliases => 'createdDate', :type => :time
        attribute :created_by, 	       :aliases => 'createdBy'
        attribute :last_modified_date, :aliases => 'lastModifiedDate', :type => :time
        attribute :last_modified_by,   :aliases => 'lastModifiedBy'
        attribute :state

        def update
          requires :id

          options = {}
          options[:name]                 = name if name
          options[:description]          = description if description
          options[:licenceType]          = licence_type if licence_type
          options[:cpuHotPlug]           = cpu_hot_plug if cpu_hot_plug
          options[:cpuHotUnplug]         = cpu_hot_unplug if cpu_hot_unplug
          options[:ramHotPlug]           = ram_hot_plug if ram_hot_plug
          options[:ramHotUnplug]         = ram_hot_unplug if ram_hot_unplug
          options[:nicHotPlug]           = nic_hot_plug if nic_hot_plug
          options[:nicHotUnplug]         = nic_hot_unplug if nic_hot_unplug
          options[:discVirtioHotPlug]    = disc_virtio_hot_plug if disc_virtio_hot_plug
          options[:discVirtioHotUnplug]  = disc_virtio_hot_unplug if disc_virtio_hot_unplug
          options[:discScsiHotPlug]      = disc_scsi_hot_plug if disc_scsi_hot_plug
          options[:discScsiHotUnplug]    = disc_scsi_hot_unplug if disc_scsi_hot_unplug

          data = service.update_image(id, options)
          merge_attributes(flatten(data.body))
          true
        end

        def delete
          requires :id
          service.delete_image(id)
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
