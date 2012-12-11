VCR.use_cassette('cartodb spec models') do
  class MotoGPCircuit < CartoDB::Model::Base
    field :name
    field :description
    field :length
    field :width
    field :longest_straight
    field :left_corners,  :type => Integer
    field :right_corners, :type => Integer
    field :constructed,   :type => Date
    field :modified,      :type => Date
  end

  class StandardModel < CartoDB::Model::Base
  end

  class CustomTableName < CartoDB::Model::Base
    cartodb_table_name 'my_table_with_custom_name'
  end

  class CustomDataTypeColumnModel < CartoDB::Model::Base
    field :test, :type => 'integer'
  end

  class PolygonGeometryModel < CartoDB::Model::Base
    set_geometry_type :polygon
    field :another_column
  end

  class GeometryGeometryModel < CartoDB::Model::Base
    set_geometry_type :geometry
    field :another_column
  end
end
