module Fog
  module Compute
    class XenServer
      module Models
        class Event < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=event

          provider_class :event
          collection_name :events

          identity :reference

          attribute :klass, :aliases => :class, :as => :class
          attribute :id
          attribute :obj_uuid
          attribute :operation
          attribute :ref
          attribute :timestamp

          def register(classes)
            service.register_event(classes)
          end

          def next
            service.next_event
          end
        end
      end
    end
  end
end
