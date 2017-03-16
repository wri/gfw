require 'fog/core/collection'
require 'fog/sakuracloud/models/script/note'

module Fog
  module SakuraCloud
    class Script
      class Notes < Fog::Collection
        model Fog::SakuraCloud::Script::Note

        def all
          load service.list_notes.body['Notes']
        end

        def get(id)
          all.find { |f| f.id == id }
        rescue Fog::Errors::NotFound
          nil
        end

        def delete(id)
          service.delete_note(id)
          true
        end
      end
    end
  end
end
