module CartoDB
  module Model
    module Constants
      include RGeo::Feature

      CARTODB_TYPES = {
        String     => 'text',
        Integer    => 'numeric',
        Numeric    => 'numeric',
        Date       => 'date',
        DateTime   => 'date',
        TrueClass  => 'boolean',
        FalseClass => 'boolean',
        Point      => 'geometry'
      }.freeze

      INVALID_COLUMNS = [
        :cartodb_id,
        :id
      ].freeze

      GEOMETRY_COLUMN = 'the_geom'.freeze

      RGEO_FACTORY = ::RGeo::Geographic.simple_mercator_factory(:srid => 4326)

      DEFAULT_ROWS_PER_PAGE = 10.freeze

    end
  end
end
