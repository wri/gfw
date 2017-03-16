require 'fog/core/collection'
require 'fog/aliyun/models/compute/snapshot'

module Fog
  module Compute
    class Aliyun
      class Snapshots < Fog::Collection
        # attribute :filters
        model Fog::Compute::Aliyun::Snapshot

        # def initialize(attributes)
        #   self.filters ||= {}
        #   super
        # end

         def all(filters_arg = {})
          unless filters_arg.is_a?(Hash)
            Fog::Logger.deprecation("all with #{filters_arg.class} param is deprecated, use all('snapshotIds' => []) instead [light_black](#{caller.first})[/]")
            filters_arg = {'snapshotIds' => [*filters_arg]}
          end
          volume_id = filters_arg[:volume_id]
          volume_type = filters_arg[:volume_type]
          if volume_id
            filters_arg[:diskId]=volume_id
          end
          if volume_type
            filters_arg[:sourseDiskType]=volume_type
          end
          data = Fog::JSON.decode(service.list_snapshots(filters_arg).body)['Snapshots']['Snapshot']
          load(data)
        end

        def get(snapshot_id)
          if snapshot_id
            snapshotIds=Array.new(1,snapshot_id)
            self.class.new(:service => service).all(:snapshotIds => snapshotIds)[0]
          end
        end
      end
    end
  end
end
