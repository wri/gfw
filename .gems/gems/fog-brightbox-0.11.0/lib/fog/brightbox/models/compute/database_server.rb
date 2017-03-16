module Fog
  module Compute
    class Brightbox
      class DatabaseServer < Fog::Brightbox::Model
        include Fog::Brightbox::Compute::ResourceLocking

        identity :id
        attribute :url
        attribute :resource_type

        attribute :name
        attribute :description
        attribute :state, :aliases => "status"

        attribute :admin_username
        attribute :admin_password

        attribute :database_engine
        attribute :database_version

        attribute :maintenance_weekday
        attribute :maintenance_hour

        # This is a crontab formatted string e.g. "* 5 * * 0"
        attribute :snapshots_schedule, :type => :string
        attribute :snapshots_schedule_next_at, :type => :time

        attribute :created_at, :type => :time
        attribute :updated_at, :type => :time
        attribute :deleted_at, :type => :time

        attribute :allow_access

        attribute :flavor_id, "alias" => "database_server_type", :squash => "id"
        attribute :zone_id, "alias" => "zone", :squash => "id"

        attribute :cloud_ips

        def save
          options = {
            :name => name,
            :description => description
          }

          options[:allow_access] = allow_access if allow_access

          options[:maintenance_weekday] = maintenance_weekday
          options[:maintenance_hour] = maintenance_hour

          if persisted?
            data = update_database_server(options)
          else
            options[:engine] = database_engine if database_engine
            options[:version] = database_version if database_version
            options[:database_type] = flavor_id if flavor_id
            options[:zone] = zone_id if zone_id

            data = create_database_server(options)
          end

          merge_attributes(data)
          true
        end

        def ready?
          state == "active"
        end

        def snapshot(return_snapshot = false)
          requires :identity

          response, snapshot_id = service.snapshot_database_server(identity, :return_link => return_snapshot)
          merge_attributes(response)

          if return_snapshot
            service.database_snapshots.get(snapshot_id)
          else
            true
          end
        end

        def destroy
          requires :identity
          merge_attributes(service.destroy_database_server(identity))
          true
        end

        def reset_password
          requires :identity
          merge_attributes(service.reset_password_database_server(identity))
          true
        end

        private

        def create_database_server(options)
          service.create_database_server(options)
        end

        def update_database_server(options)
          service.update_database_server(identity, options)
        end
      end
    end
  end
end
