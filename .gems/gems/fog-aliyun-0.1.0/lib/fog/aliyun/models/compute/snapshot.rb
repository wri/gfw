require 'fog/core/model'
module Fog
  module Compute
    class Aliyun
      class Snapshot < Fog::Model
        identity  :id,          :aliases => 'SnapshotId'
        attribute :name,        :aliases => 'SnapshotName'
        attribute :description, :aliases => 'Description'
        attribute :progress,    :aliases => 'Progress'
        attribute :volume_id,     :aliases => 'SourceDiskId'
        attribute :volume_size,   :aliases => 'SourceDiskSize'
        attribute :volume_type,   :aliases => 'SourceDiskType'
        attribute :product_code,:aliases => 'ProductCode'
        attribute :created_at,  :aliases => 'CreationTime'
        attribute :state,       :aliases => 'Status'
        attribute :usage,       :aliases => 'Usage'
        attribute :tags,        :aliases => 'Tags'

        def destroy
          requires :id
          service.delete_snapshot(id)
          true
        end

        def ready?
          state == 'accomplished'
        end

        def save(options={})
          # raise Fog::Errors::Error.new('Resaving an existing object may create a duplicate') if persisted?
          requires :volume_id
          options[:name] = name if name
          options[:description]=description if description
          data = Fog::JSON.decode(service.create_snapshot(volume_id, options).body)
          merge_attributes(data)
          true
        end

        def volume
          requires :volume_id
          Fog::Compute::Aliyun::Volumes.new(:service=>service).all(:diskIds=>[volume_id])[0]
        end

        private

        def volume=(new_volume)
          self.volume_id = new_volume.id
        end
      end
    end
  end
end
