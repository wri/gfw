module Fog
  module Compute
    class XenServer
      module Models
        module InstanceMethods
          def provider_class
            self.class.provider_class
          end

          def collection
            service.send(self.class.collection_name)
          end

          def require_creation_attributes
            requires *self.class.instance_variable_get("@require_before_save")
          end

          def set_attribute(name, *val)
            service.set_attribute(provider_class, reference, name, *val)
          end

          def save(extra_params = {})
            require_creation_attributes
            attrs = all_associations_and_attributes.reject { |_key, value| value.nil? }
            ref = service.send("create_#{provider_class.downcase}", attrs, extra_params)
            merge_attributes collection.get(ref).attributes
            true
          end

          def destroy
            requires :reference
            service.send(:destroy_record, reference, provider_class)
            true
          end

          def method_missing(method_name, *args)
            if service.respond_to?("#{method_name}_#{provider_class.downcase}")
              result = service.send("#{method_name}_#{provider_class.downcase}", reference, *args)
              reload
              result
            else
              super
            end
          end

          def respond_to?(method_name, include_private = false)
            return true if service.respond_to?("#{method_name}_#{provider_class.downcase}")
            super
          end
        end
      end
    end
  end
end
