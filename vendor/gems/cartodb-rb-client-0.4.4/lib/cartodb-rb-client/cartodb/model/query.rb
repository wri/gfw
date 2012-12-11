module CartoDB
  module Model
    module Query

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods

        def select(*fields)
          scope = Scope.new(self)
          scope.select(fields)
        end

        def all
          scope = Scope.new(self)
          scope.all
        end

        def where(attributes = nil, *rest)
          scope = Scope.new(self)
          scope.where(attributes, rest)
        end

        def find(id)
          where(id)
        end

        def count
          begin
            results = connection.query "SELECT COUNT(CARTODB_ID) FROM #{table_name}"
            results.rows.first[:count].try(:to_i)
          rescue Exception => e
            0
          end
        end

        def page(page_number)
          scope = Scope.new(self)
          scope.page(page_number)
        end

        def per_page(ammount)
          scope = Scope.new(self)
          scope.page(page_number)
        end

        def order(order_clause)
          scope = Scope.new(self)
          scope.order(order_clause)
        end

      end

      def count
        self.class.count
      end

      def count=(ammount)
        self.class.count= ammount
      end

    end
  end
end
