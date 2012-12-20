module CartoDB
  module Helpers
    module SqlHelper
      require 'time'

      def prepare_data(hash)
        new_hash = {}
        hash.each do |key, value|
          new_hash[key] = format_value(key, value)
        end
        new_hash
      end

      def format_value(key, value)
        case value
        when ::String
          "E'#{value.gsub(/\\/, '\&\&').gsub(/'/, "''")}'"
        when ::Date, ::DateTime, ::Time
          "'#{value.to_time.utc}'"
        when RGeo::Feature::Geometry
          "'#{RGeo::WKRep::WKBGenerator.new(:type_format => :ewkb, :emit_ewkb_srid => true, :hex_format => true).generate(value)}'"
        when NilClass
          'NULL'
        else
          value
        end
      end
      private :format_value

    end
  end
end
