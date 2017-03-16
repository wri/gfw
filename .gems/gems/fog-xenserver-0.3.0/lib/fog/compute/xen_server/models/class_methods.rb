module Fog
  module Compute
    class XenServer
      module Models
        module ClassMethods
          def provider_class(provider_class = nil)
            return @provider_class if provider_class.nil?
            @provider_class = provider_class.to_s
          end

          def collection_name(collection_name = nil)
            return @collection_name if collection_name.nil?
            @collection_name = collection_name
          end

          def require_before_save(*args)
            return @require_before_save || [] if args.empty?
            @require_before_save = args
          end
        end
      end
    end
  end
end