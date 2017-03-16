require "fog/core/collection"

module Fog
  module Compute
    class XenServer
      module Models
        class Servers < Collection
          model Fog::Compute::XenServer::Models::Server

          def templates
            Fog::Logger.deprecation "This method is DEPRECATED. Call #templates directly on the connection instead."
            service.templates
          end

          def custom_templates
            Fog::Logger.deprecation "This method is DEPRECATED. Call #custom_templates directly on the connection instead."
            service.custom_templates
          end

          def builtin_templates
            Fog::Logger.deprecation "This method is DEPRECATED. Call #builtin_templates directly on the connection instead."
            service.builtin_templates
          end

          def all(options = {})
            data = service.get_records "VM"
            # Exclude templates
            data.delete_if { |vm| vm[:is_control_domain] or vm[:is_a_template] }
            data.delete_if { |vm| vm[:is_a_snapshot] and !options[:include_snapshots] }
            data.delete_if { |vm| options[:name_matches] and (vm[:name_label] !~ /#{Regexp.escape(options[:name_matches])}/i ) }
            data.delete_if { |vm| options[:name_equals] and (vm[:name_label] != options[:name_equals] ) }
            load(data)
          end
        end
      end
    end
  end
end