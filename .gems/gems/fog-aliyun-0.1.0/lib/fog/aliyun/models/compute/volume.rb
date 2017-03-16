require 'fog/core/model'
module Fog
  module Compute
    class Aliyun
      class Volume < Fog::Model

        # "ImageId": "",
        # "InstanceId": "",
        # "OperationLocks": {
        #     "OperationLock": []
        # },
        # "Portable": true,
        # "ProductCode": "",
        # "RegionId": "cn-qingdao",
        # "Size": 5,
        # "SourceSnapshotId": "",
        # "Status": "Available",
        # "Type": "data",

        identity  :id,                    :aliases => 'DiskId'
        attribute :region_id,             :aliases => 'RegionId'
        attribute :zone_id,               :aliases => 'ZoneId'
        attribute :name,                  :aliases => 'DiskName'
        attribute :description,           :aliases => 'Description'
        attribute :type,                  :aliases => 'Type'
        attribute :category,              :aliases => 'Category'
        attribute :size,                  :aliases => 'Size'
        attribute :image_id,              :aliases => 'ImageId'
        attribute :snapshot_id,           :aliases => 'SourceSnapshotId'
        attribute :product_code,          :aliases => 'ProductCode'
        attribute :portable,              :aliases => 'Portable'
        attribute :state,                 :aliases => 'Status'
        attribute :operation_locks,       :aliases => 'OperationLocks'
        attribute :server_id,             :aliases => 'InstanceId'
        attribute :device,                :aliases => 'Device'
        attribute :delete_with_instance,  :aliases => 'DeleteWithInstance'
        attribute :delete_auto_snapshot,  :aliases => 'DeleteAutoSnapshot'
        attribute :enable_auto_snapshot,  :aliases => 'EnableAutoSnapshot'
        attribute :created_at,            :aliases => 'CreationTime'
        attribute :attached_at,           :aliases => 'AttachedTime'
        attribute :detached_at,           :aliases => 'DetachedTime'
        attribute :expired_at,            :aliases => 'ExpiredTime'
        attribute :charge_type,           :aliases => 'DiskChargeType'
        attribute :tags,                  :aliases => 'Tags'
        

        def destroy
          requires :id

          service.delete_disk(id)
          true
        end

        def ready?
          requires :state
          state == 'Available'
        end

        def save(options={})
          # raise Fog::Errors::Error.new('Resaving an existing object may create a duplicate') if persisted?
          # requires :availability_zone
          requires_one :size, :snapshot_id
          options[:name] = name if name
          options[:description]=description if description
          if snapshot_id
            data=Fog::JSON.decode(service.create_disk_by_snapshot(snapshot_id,options).body)
            merge_attributes(data)
          elsif size
            data = Fog::JSON.decode(service.create_disk(size,options).body)
            merge_attributes(data)
          end          
         
          true
        end

        def image
          requires :image_id
          Fog::Compute::Aliyun::Images.new(:service=>service).all(:imageId=>image_id)[0]
        end        

        def snapshots
          requires :id
          Fog::Compute::Aliyun::Snapshots.new(:service=>service).all(:volume_id=>id)
        end

        def source
          requires :snapshot_id
          Fog::Compute::Aliyun::Snapshots.new(:service=>service).all(:snapshotIds => [snapshot_id])[0]
        end

        private

        def source=(new_source)
          self.snapshot_id=new_source.id
        end

        def image=(new_image)
          self.image_id = new_image.id
        end

      end
    end
  end
end

