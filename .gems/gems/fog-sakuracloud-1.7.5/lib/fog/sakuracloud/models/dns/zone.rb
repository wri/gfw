require 'fog/core/model'

module Fog
  module DNS
    class SakuraCloud
      class Zone < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :name, :aliases => 'Name'
        attribute :description, :aliases => 'Description'
        attribute :status, :aliases => 'Status'
        attribute :settings, :aliases => 'Settings'
        attribute :tags, :aliases => 'Tags'

        ## Reader methods for nested values.
        # Returns value or nil
        def rr_sets
          settings.fetch('DNS', {}).fetch('ResourceRecordSets', []) if settings
        end

        def rr_sets=(rrsets)
          raise "ResourceRecordSets must be Array of Hash!" unless rrsets.is_a?(Array)
          self.settings = {
            'DNS' => {
              'ResourceRecordSets' => rrsets
            }
          }
        end

        def zone
          status.fetch('Zone') if status
        end

        def nameservers
          status.fetch('NS') if status
        end

        def delete
          service.delete_zone(identity)
          true
        end
        alias_method :destroy, :delete

        def save
          requires :zone
          if identity
            Fog::Logger.warning("Update DNS Zone #{identity}")
            data = service.modify_zone(@attributes).body["CommonServiceItem"]
          else
            Fog::Logger.warning("Create DNS Zone")
            data = service.create_zone(@attributes).body["CommonServiceItem"]
          end
          merge_attributes(data)
          true
        end
      end
    end
  end
end
