module Fog
  module AWS
    class RDS
      class Cluster < Fog::Model
        identity :id, :aliases => 'DBClusterIdentifier'

        attribute :allocated_storage,            :aliases => 'AllocatedStorage',          :type => :integer
        attribute :backup_retention_period,      :aliases => 'BackupRetentionPeriod',     :type => :integer
        attribute :db_cluster_members,           :aliases => 'DBClusterMembers',          :type => :array
        attribute :db_cluster_parameter_group,   :aliases => 'DBClusterParameterGroup'
        attribute :db_subnet_group,              :aliases => 'DBSubnetGroupName'
        attribute :endpoint,                     :aliases => 'Endpoint'
        attribute :engine,                       :aliases => 'Engine'
        attribute :engine_version,               :aliases => 'EngineVersion'
        attribute :password,                     :aliases => 'MasterUserPassword'
        attribute :master_username,              :aliases => 'MasterUsername'
        attribute :port,                         :aliases => 'Port',                      :type => :integer
        attribute :preferred_backup_window,      :aliases => 'PreferredBackupWindow'
        attribute :preferred_maintenance_window, :aliases => 'PreferredMaintenanceWindow'
        attribute :state,                        :aliases => 'Status'
        attribute :vpc_security_groups,          :aliases => 'VpcSecurityGroups'

        attr_accessor :storage_encrypted #not in the response

        def ready?
          state == "available"
        end

        def snapshots
          requires :id
          service.cluster_snapshots(:cluster => self)
        end

        def servers(set=db_cluster_members)
          set.map do |member|
            service.servers.get(member['DBInstanceIdentifier'])
          end
        end

        def master
          db_cluster_members.detect { |member| member["master"] }
        end

        def replicas
          servers(db_cluster_members.select { |member| !member["master"] })
        end

        def has_replica?(replica_name)
          replicas.detect { |replica| replica.id == replica_name }
        end

        def destroy(snapshot_identifier=nil)
          requires :id
          service.delete_db_cluster(id, snapshot_identifier, snapshot_identifier.nil?)
          true
        end

        def save
          requires :id
          requires :engine
          requires :master_username
          requires :password

          data = service.create_db_cluster(id, attributes_to_params)
          merge_attributes(data.body['CreateDBClusterResult']['DBCluster'])
          true
        end

        def attributes_to_params
          options = {
            'AllocatedStorage'           => allocated_storage,
            'BackupRetentionPeriod'      => backup_retention_period,
            'DBClusterIdentifier'        => identity,
            'DBClusterParameterGroup'    => db_cluster_parameter_group,
            'DBSubnetGroupName'          => db_subnet_group,
            'Endpoint'                   => endpoint,
            'Engine'                     => engine,
            'EngineVersion'              => engine_version,
            'MasterUserPassword'         => password,
            'MasterUsername'             => master_username,
            'PreferredBackupWindow'      => preferred_backup_window,
            'PreferredMaintenanceWindow' => preferred_maintenance_window,
            'Status'                     => state,
            'StorageEncrypted'           => storage_encrypted,
            'VpcSecurityGroups'          => vpc_security_groups,
          }

          options.delete_if { |key,value| value.nil? }
        end
      end
    end
  end
end
