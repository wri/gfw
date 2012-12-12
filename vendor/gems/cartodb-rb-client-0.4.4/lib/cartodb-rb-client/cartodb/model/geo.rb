module CartoDB
  module Model
    module Geo
      include CartoDB::Model::Constants

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        include CartoDB::Model::Constants

        def setup_geometry_column(geometry_column)
          return if geometry_column[:geometry_type].nil?

          geometry_name = geometry_column[:name].to_sym

          self.send :define_method, :the_geom do
            self.attributes[geometry_name]
          end

          self.send :define_method, :the_geom= do |the_geom|
            self.attributes[geometry_name] = convert_to_geometry(the_geom)
          end
        end
        private :setup_geometry_column

      end

      def prepare_geo_attributes(attributes)
        return if attributes.nil?

        attributes[:the_geom] = convert_to_geometry(attributes[:the_geom])

        attributes
      end
      private :prepare_geo_attributes

      def convert_to_geometry(the_geom)
        case the_geom
        when String
          RGeo::GeoJSON.decode(the_geom, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326))
        when Hash
          RGeo::GeoJSON.decode(::JSON.generate(the_geom), :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326))
        else
          the_geom
        end
      end
      private :convert_to_geometry

    end
  end
end
