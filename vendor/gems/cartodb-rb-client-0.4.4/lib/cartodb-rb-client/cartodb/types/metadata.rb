module CartoDB
  module Types
    class Metadata < Hash

      RESERVED_WORDS = %w(
        alias and BEGIN begin break case class def defined? do else elsif END end
        ensure false for if in module next nil not or redo rescue retry return self
        super then true undef unless until when while yield
      )

      class << self
        def from_hash(hash = {})
          metadata = self.new

          hash.each do |key, value|
            metadata[key.to_sym] = value
          end
          metadata
        end
      end

      def []=(key, value)
        key = :"#{key}_" if RESERVED_WORDS.include?(key.to_s)

        if key.to_s.eql?('the_geom')
          value = _geometry_features(value)
        else
          value = cast_value(value) unless CartoDB::Settings[:type_casting] == false
        end

        self.class.send :define_method, "#{key}" do
          self[key.to_sym]
        end

        self.class.send :define_method, "#{key}=" do |value|
          self[key.to_sym] = value
        end

        super(key, value)
      end

      def method_missing(name, *args, &block)
        if name.to_s.end_with?('=') && args.size == 1
          key = name.to_s[0...-1]
          self[key.to_sym] = args[0]
        else
          super
        end
      end

      def _geometry_features(the_geom)

        begin
          the_geom = RGeo::WKRep::WKBParser.new(RGeo::Geographic.spherical_factory(:srid => 4326), :support_ewkb => true).parse(the_geom)
        rescue
          begin
            the_geom = RGeo::GeoJSON.decode(the_geom, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326))
          rescue
          end
        end

        the_geom
      end
      private :_geometry_features

      def cast_value(value)
        return nil   if value.nil?
        return true  if value.eql?('t')
        return false if value.eql?('f')

        begin
          value = Float(value)
          return value == value.floor ? value.to_i : value
        rescue
        end

        return DateTime.strptime(value, '%Y-%m-%d') rescue
        return DateTime.strptime(value, '%d-%m-%Y') rescue

        value
      end
      private :cast_value

    end
  end
end
