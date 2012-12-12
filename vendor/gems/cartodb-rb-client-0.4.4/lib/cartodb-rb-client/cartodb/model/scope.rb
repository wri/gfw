module CartoDB
  module Model
    class Scope
      extend Forwardable
      include CartoDB::Model::Constants

      def_delegators :@model, :connection, :table_name, :cartodb_table

      def initialize(model)
        @model         = model
        @records       = nil
        @custom_fields = nil
        @rows_per_page = nil
      end

      def to_a
        @records ||= begin

          results = connection.query build_sql

          if results && results.rows
            results.rows.map{|r| @model.new(r)}
          else
            []
          end
        rescue Exception => e
          []
        end

      end
      alias all to_a

      def length
        to_a.length
      end
      alias size length
      alias count length

      def select(*fields)
        case fields
        when String
          @custom_fields = fields
        when Array
          @custom_fields = fields.join(', ')
        end

        self
      end

      def where(attributes = nil, *rest)
        @records = nil
        return all if attributes.nil? || (attributes.is_a?(Hash) && attributes.empty?) || (attributes.is_a?(Integer) && attributes <= 0)

        if attributes.is_a?(Integer) || (attributes.length == 1 && (attributes[:cartodb_id] || attributes[:id]))
          row_id = attributes.is_a?(Integer) ? attributes : (attributes[:cartodb_id] || attributes[:id])
          return @model.new(connection.row(table_name, row_id))
        end

        create_filters(attributes, rest)

        self
      end

      def page(page_number)
        @page = page_number

        self
      end

      def per_page(ammount)
        @rows_per_page = ammount

        self
      end

      def order(order_clause)
        @order_clauses ||= []
        @order_clauses << order_clause

        self
      end

      def method_missing(method, *args, &block)
        if Array.method_defined?(method)
          to_a.send(method, *args, &block)
        else
          super
        end
      end
      protected :method_missing

      def filters
        @filters ||= []
      end
      private :filters

      def build_sql
        select     = build_select
        from       = build_from
        where      = build_where
        order      = build_order
        pagination = build_pagination

        sql = "#{select} #{from} #{where} #{order} #{pagination}"
      end
      alias to_sql build_sql

      def build_select
        columns = @custom_fields || cartodb_table.schema.map{|c| c[0]}.join(', ')
        select = "SELECT #{columns}"
      end
      private :build_select

      def build_from
        from = "FROM #{table_name}"
      end
      private :build_from

      def build_where
        where = "WHERE #{filters.join(' AND ')}" if filters && filters.any?
      end
      private :build_where

      def build_pagination
        offset = (current_page - 1) * rows_per_page
        pagination = "LIMIT #{rows_per_page} OFFSET #{offset}"
      end
      private :build_pagination

      def build_order
        order = "ORDER BY #{order_clauses.join(', ')}" unless order_clauses.nil? || order_clauses.empty?
      end
      private :build_order

      def create_filters(attributes, values)
        case attributes
        when Hash
          filters << attributes.to_a.map{|i| "#{table_name}.#{i.first} = #{i.last}"}.join(' AND ')
        when String
          values = values.flatten
          filters << attributes.gsub(/[\?]/){|r| values.shift}
        end
      end
      private :create_filters

      def current_page
        @page || 1
      end
      private :current_page

      def rows_per_page
        @rows_per_page || DEFAULT_ROWS_PER_PAGE
      end
      private :rows_per_page

      def order_clauses
        @order_clauses || []
      end
      private :order_clauses

    end
  end
end
