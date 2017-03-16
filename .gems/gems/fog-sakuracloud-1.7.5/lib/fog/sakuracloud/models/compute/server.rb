require 'fog/core/model'

module Fog
  module Compute
    class SakuraCloud
      class Server < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :name, :aliases => 'Name'
        attribute :server_plan, :aliases => 'ServerPlan'
        attribute :instance, :aliases => 'Instance'
        attribute :disks, :aliases => 'Disks'
        attribute :interfaces, :aliases => 'Interfaces'

        def save
          requires :name, :server_plan
          data = service.create_server(@attributes).body["Server"]
          merge_attributes(data)
          true
        end

        def boot
          requires :id
          service.boot_server(id)
        end

        def stop(force = false)
          requires :id
          service.stop_server(id, force)
        end

        def delete(force = false, disks = [])
          requires :id
          service.delete_server(id, force, disks)
          true
        end
        alias_method :destroy, :delete
      end
    end
  end
end
