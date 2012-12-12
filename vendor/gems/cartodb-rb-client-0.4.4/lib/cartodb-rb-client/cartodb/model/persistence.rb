module CartoDB
  module Model
    module Persistence
      include CartoDB::Model::Constants

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods

        def create(attributes = {})
          model = self.new attributes
          model.save
          model
        end

      end

      def save
        if new_record?
          create_row
        else
          update_row
        end
      end

      def destroy
        unless new_record?
          delete_row
        end
      end

      def new_record?
        cartodb_id.nil? || cartodb_id <= 0
      end

      def create_row
        inserted_record = connection.insert_row table_name, attributes_for_insert
        self.cartodb_id = inserted_record.id
      end
      private :create_row

      def update_row
        connection.update_row table_name, cartodb_id, attributes_for_update
      end
      private :update_row

      def delete_row
        connection.delete_row table_name, cartodb_id
      end
      private :delete_row

      def attributes_for_insert
        # only the columns defined in the model are allowed to be inserted
        row = attributes.symbolize_keys.reject{|key,value| INVALID_COLUMNS.include?(key) || !column_names.include?(key.to_s) }
        row
      end
      private :attributes_for_insert

      def attributes_for_update
        row = attributes.reject{|key,value| !column_names.include?(key.to_s) }
        row
      end
      private :attributes_for_update

    end
  end
end
