module CartoDB
  module Client
    module Utils

      def self.parse_json(response)
        json = nil

        unless response.nil? || response.body.nil? || response.body.strip == ''
          begin
            json = ::JSON.parse(response.body, :object_class => CartoDB::Types::Metadata, :symbolize_names => true)
          rescue JSON::ParserError => e
            json = CartoDB::Types::Metadata.new
          end
        end
        json
      end

    end
  end
end
