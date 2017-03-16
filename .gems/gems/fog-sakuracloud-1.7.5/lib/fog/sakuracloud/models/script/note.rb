require 'fog/core/model'

module Fog
  module SakuraCloud
    class Script
      class Note < Fog::Model
        identity :id, :aliases => 'ID'
        attribute :name, :aliases => 'Name'
        attribute :note_class, :aliases => 'Class'
        attribute :scope, :aliases => 'Scope'
        attribute :content, :aliases => 'Content'
        attribute :description, :aliases => 'Description'
        attribute :remark, :aliases => 'Remark'
        attribute :availability, :aliases => 'Availability'
        attribute :icon, :aliases => 'Icon'


        def delete
          service.delete_note(identity)
          true
        end
        alias_method :destroy, :delete

        def save
          requires :name, :content
          if identity
            Fog::Logger.warning("Update Note #{identity}")
            data = service.modify_note(@attributes).body["Note"]
          else
            Fog::Logger.warning("Create New Note")
            data = service.create_note(@attributes).body["Note"]
          end
          merge_attributes(data)
          true
        end
      end
    end
  end
end
