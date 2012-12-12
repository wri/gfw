module CartoDB
  module Model
    module Defaults

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods

      end

    end
  end
end