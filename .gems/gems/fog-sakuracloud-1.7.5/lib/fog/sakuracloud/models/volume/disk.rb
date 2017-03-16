require 'fog/core/model'

module Fog
  module Volume
    class SakuraCloud
      class Disk < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :name, :aliases => 'Name'
        attribute :connection, :aliases => 'Connection'
        attribute :availability, :aliases => 'Availability'
        attribute :plan, :aliases => 'Plan'
        attribute :size_mb, :aliases => 'SizeMB'
        attribute :source_disk, :aliases => 'SourceDisk'
        attribute :source_archive, :aliases => 'SourceArchive'

        def delete
          service.delete_disk(identity)
          true
        end
        alias_method :destroy, :delete

        def save
          requires :name, :plan
          options = {
            :source_archive => source_archive,
            :size_mb => size_mb
          } 
          data = service.create_disk(name, plan, options).body["Disk"]
          merge_attributes(data)
          true
        end

        def configure(sshkey_id)
          requires :id
          service.configure_disk(id, sshkey_id )
          true
        end

        def carve_hostname_on_disk(hostname)
          requires :id
          service.carve_hostname_on_disk(id, hostname )
          true
        end

        def attach(server_id)
          service.attach_disk(id, server_id)
          true
        end

        def associate_ip(ipaddress, networkmasklen, defaultroute)
          subnet ={
            :ipaddress => ipaddress,
            :networkmasklen => networkmasklen,
            :defaultroute => defaultroute
          }
          requires :id
          service.associate_ip_to_disk(id, subnet )
          true
        end

        def register_script(notes)
          note_ids = []
          note_ids << notes
          requires :id
          service.register_note_to_disk(id, note_ids.flatten )
          true
        end
      end
    end
  end
end
