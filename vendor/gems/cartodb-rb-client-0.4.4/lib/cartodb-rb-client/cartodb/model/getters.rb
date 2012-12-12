module CartoDB
  module Model
    module Getters
      attr_reader :table, :attributes

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods

        def connection
          CartoDB::Connection
        end

        def table_name
          @table_name ||= self.name.tableize
        end

        def cartodb_table
          @cartodb_table = begin
            connection.table table_name
          rescue CartoDB::Client::Error
            nil
          end
        end

        def columns
          update_cartodb_schema unless schema_synchronized?
          @columns
        end

        def data_columns
          columns.reject{|c| %w(cartodb_id created_at updated_at).include?(c[:name])}.compact
        end

        def geometry_type
          @geometry_type
        end

        def model_columns
          @model_columns || []
        end
        private :model_columns

      end

      def connection
        self.class.connection
      end

      def table_name
        self.class.table_name
      end

      def cartodb_table
        self.class.cartodb_table
      end

      def columns
        self.class.columns
      end

      def attributes
        @attributes ||= {}
      end

      def column_names
        columns.map{|column| column[:name]}
      end
      private :column_names

    end
  end
end
