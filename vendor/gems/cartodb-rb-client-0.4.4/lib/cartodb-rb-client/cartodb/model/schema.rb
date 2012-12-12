module CartoDB
  module Model
    module Schema

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        include CartoDB::Model::Constants

        def schema_synchronized?
          cartodb_table && @columns_synchronized
        end

        def cartodb_table_exists?
          begin
            cartodb_table && cartodb_table.name.eql?(table_name)
          rescue CartoDB::Client::Error => e
            e.status_code != 404
          end
        end

        def field(name, options = {:type => String})
          return if name == 'the_geom'

          @columns_synchronized = false
          @model_columns ||= []
          column = {
            :name => name.to_s,
            :type =>  CARTODB_TYPES[options[:type]] || options[:type]
          }
          return if model_columns.include?(column)

          model_columns << column
          update_cartodb_schema
        end
        private :field

        def set_geometry_type(geometry_type = Point)
          self.geometry_type = case geometry_type
                               when Class, Module
                                 geometry_type.name.split('::').last.downcase
                               else
                                 geometry_type.to_s.downcase
                               end
        end
        private :set_geometry_type

        def update_cartodb_schema
          table = nil
          if cartodb_table_exists?
            table = cartodb_table
          else
            table = connection.create_table table_name, geometry_type
          end

          read_metadata table
          create_missing_columns
          create_column_accessors
          @columns_synchronized = true
        end
        private :update_cartodb_schema

        def read_metadata(table)
          extract_columns table
        end
        private :read_metadata

        def extract_columns(table)
          @columns = table.schema.map{|c| c[0].eql?('the_geom') ? {:name => c[0], :type => c[1], :geometry_type => c[3]} : {:name => c[0], :type => c[1]}}
        end
        private :extract_columns

        def create_missing_columns
          table_column_names = @columns.map{|c| c[:name]}
          missing_columns = model_columns.reject{|c| table_column_names.include?(c[:name])}
          return unless missing_columns && missing_columns.any?

          missing_columns.each do |column|
            connection.add_column table_name, column[:name], column[:type]
          end

          self.cartodb_table = nil
          read_metadata self.cartodb_table
        end
        private :create_missing_columns

        def create_column_accessors
          @columns.each do |c|
            column_name = c[:name]
            column_type = c[:type]

            if column_name.eql?(GEOMETRY_COLUMN) || column_type.eql?('geometry')
              setup_geometry_column(c)
            else
              self.send :define_method, column_name do
                self.attributes[column_name.to_sym]
              end

              self.send :define_method, "#{column_name}=" do |value|
                self.attributes[column_name.to_sym] = value
              end
            end
          end
        end
        private :create_column_accessors

      end

      def schema_synchronized?
        self.class.schema_synchronized? && cartodb_table_exists?
      end

      def cartodb_table_exists?
        self.class.cartodb_table_exists?
      end

    end
  end
end
