module Fog
  module Compute
    class Terremark
      class Image < Fog::Model
        identity :id

        attribute :name
      end

      private

      def href=(new_href)
        self.id = new_href.split("/").last.to_i
      end
    end
  end
end
