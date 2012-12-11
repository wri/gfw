module CartoDB
  module Model
    module Setters
      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods

        def cartodb_table_name(table_name)
          @table_name = table_name
        end

        def cartodb_table=(table)
          @cartodb_table = table
        end

        def columns=(columns)
          @columns = columns
        end

        def geometry_type=(geometry_type)
          @geometry_type = geometry_type
        end
      end

      def cartodb_table=(table)
        self.class.cartodb_table = table
      end

      def attributes=(attributes)
        @attributes = prepare_geo_attributes(attributes)
      end

    end
  end
end
