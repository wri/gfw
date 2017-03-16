require 'fog/core/model'
module Fog
  module Compute
    class Aliyun
      class Image < Fog::Model

        identity :id,                     :aliases => 'ImageId'

        attribute :description,           :aliases => 'Description'
        attribute :product_code,          :aliases => 'ProductCode'
        attribute :os_type,               :aliases => 'OSType'
        attribute :architecture,          :aliases => 'Architecture'
        attribute :os_name,               :aliases => 'OSName'
        attribute :disk_device_mappings,  :aliases => 'DiskDeviceMappings'
        attribute :owner_alias,           :aliases => 'ImageOwnerAlias'
        attribute :progress,              :aliases => 'Progress'
        attribute :usage,                 :aliases => 'Usage'
        attribute :created_at,            :aliases => 'CreationTime'
        attribute :tags,                  :aliases => 'Tags'
        attribute :version,               :aliases => 'ImageVersion'
        attribute :state,                 :aliases => 'Status'
        attribute :name,                  :aliases => 'ImageName'
        attribute :is_self_shared,        :aliases => 'IsSelfShared'
        attribute :is_copied,             :aliases => 'IsCopied'
        attribute :is_subscribed,         :aliases => 'IsSubscribed'
        attribute :platform,              :aliases => 'Platform'
        attribute :size,                  :aliases => 'Size'
        attribute :snapshot_id,           :aliases => 'SnapshotId'

        def initialize(attributes)
          self.snapshot_id=attributes["DiskDeviceMappings"]["DiskDeviceMapping"][0]["SnapshotId"]
          super
        end

        def save (options={})
          requires :snapshot_id
          options[:name] = name if name
          options[:description]=description if description
          data=Fog::JSON.decode(service.create_image(snapshot_id,options).body)
          merge_attributes(data)
          true
        end

        def destroy
          requires :id
          service.delete_image(id)
          true
        end

        def ready?
          state == 'Available'
        end

        def snapshot
          requires :snapshot_id
          Fog::Compute::Aliyun::Snapshots.new(:service=>service).all(:snapshotIds=>[snapshot_id])[0]
        end

        private

        def snapshot=(new_snapshot)
          self.snapshot_id = new_snapshot.id
        end

      end
    end
  end
end
