require 'model_specs_helper'

describe 'CartoDB model metadata methods', :vcr => true do

  it "should have a valid CartoDB::Client instance as a connection object" do
    model = MotoGPCircuit.new
    model.connection.should_not be_nil
    table = model.connection.create_table 'model_connection_test'
    table.should_not be_nil
    table.name.should be == 'model_connection_test'
  end

  it "should have a valid table name" do
    model = MotoGPCircuit.new
    model.table_name.should be == 'moto_gp_circuit'
  end

  it "should create the table in cartodb if it doesn't exists" do
    model = MotoGPCircuit.new

    model.cartodb_table_exists?.should be_true
  end

  it "should create a table with custom name if specified" do
    model = CustomTableName.new

    model.table_name.should be == 'my_table_with_custom_name'
  end

  it "should contain an array of columns" do

    model = MotoGPCircuit.new

    model.columns.should_not be_nil
    model.columns.should have(13).items
    model.columns.should include({:name => 'cartodb_id',       :type => 'number'                                 })
    model.columns.should include({:name => 'name',             :type => 'string'                                 })
    model.columns.should include({:name => 'description',      :type => 'string'                                 })
    model.columns.should include({:name => 'the_geom',         :type => 'geometry', :geometry_type => 'geometry' })
    model.columns.should include({:name => 'created_at',       :type => 'date'                                   })
    model.columns.should include({:name => 'updated_at',       :type => 'date'                                   })
    model.columns.should include({:name => 'length',           :type => 'string'                                 })
    model.columns.should include({:name => 'width',            :type => 'string'                                 })
    model.columns.should include({:name => 'left_corners',     :type => 'number'                                 })
    model.columns.should include({:name => 'right_corners',    :type => 'number'                                 })
    model.columns.should include({:name => 'longest_straight', :type => 'string'                                 })
    model.columns.should include({:name => 'constructed',      :type => 'date'                                   })
    model.columns.should include({:name => 'modified',         :type => 'date'                                   })
  end

  it "should add more columns if the table previously exists" do
    table = CartoDB::Connection.create_table 'moto_gp_circuit'
    table.schema.should include(["cartodb_id", "number"])
    table.schema.should include(["name", "string"])
    table.schema.should include(["the_geom", "geometry", "geometry", "geometry"])
    table.schema.should include(["description", "string"])
    table.schema.should include(["created_at", "date"])
    table.schema.should include(["updated_at", "date"])
    table.schema.should_not include(['length', 'string'])
    table.schema.should_not include(['width','string'])
    table.schema.should_not include(['left_corners', 'number'])
    table.schema.should_not include(['right_corners', 'number'])
    table.schema.should_not include(['longest_straight', 'string'])
    table.schema.should_not include(['constructed', 'date'])
    table.schema.should_not include(['modified', 'date'])

    model = MotoGPCircuit.new

    model.columns.should_not be_nil
    model.columns.should have(13).items
    model.columns.should include({:name => 'cartodb_id',       :type => 'number'                                 })
    model.columns.should include({:name => 'name',             :type => 'string'                                 })
    model.columns.should include({:name => 'description',      :type => 'string'                                 })
    model.columns.should include({:name => 'the_geom',         :type => 'geometry', :geometry_type => 'geometry' })
    model.columns.should include({:name => 'created_at',       :type => 'date'                                   })
    model.columns.should include({:name => 'updated_at',       :type => 'date'                                   })
    model.columns.should include({:name => 'length',           :type => 'string'                                 })
    model.columns.should include({:name => 'width',            :type => 'string'                                 })
    model.columns.should include({:name => 'left_corners',     :type => 'number'                                 })
    model.columns.should include({:name => 'right_corners',    :type => 'number'                                 })
    model.columns.should include({:name => 'longest_straight', :type => 'string'                                 })
    model.columns.should include({:name => 'constructed',      :type => 'date'                                   })
    model.columns.should include({:name => 'modified',         :type => 'date'                                   })

  end

  it "should return only data columns" do
    columns = MotoGPCircuit.data_columns
    columns.should_not include({:name => 'cartodb_id',       :type => 'number'                             })
    columns.should_not include({:name => 'created_at',       :type => 'date'                               })
    columns.should_not include({:name => 'updated_at',       :type => 'date'                               })
    columns.should include({:name => 'name',             :type => 'string'                                 })
    columns.should include({:name => 'description',      :type => 'string'                                 })
    columns.should include({:name => 'the_geom',         :type => 'geometry', :geometry_type => 'geometry' })
    columns.should include({:name => 'length',           :type => 'string'                                 })
    columns.should include({:name => 'width',            :type => 'string'                                 })
    columns.should include({:name => 'left_corners',     :type => 'number'                                 })
    columns.should include({:name => 'right_corners',    :type => 'number'                                 })
    columns.should include({:name => 'longest_straight', :type => 'string'                                 })
    columns.should include({:name => 'constructed',      :type => 'date'                                   })
    columns.should include({:name => 'modified',         :type => 'date'                                   })

    columns = StandardModel.data_columns
    columns.should_not include({:name => 'cartodb_id',       :type => 'number'                             })
    columns.should_not include({:name => 'created_at',       :type => 'date'                               })
    columns.should_not include({:name => 'updated_at',       :type => 'date'                               })
    columns.should include({:name => 'name',             :type => 'string'                                 })
    columns.should include({:name => 'description',      :type => 'string'                                 })
    columns.should include({:name => 'the_geom',         :type => 'geometry', :geometry_type => 'geometry' })
  end

  it "should create model with custom data types columns" do
    columns = CustomDataTypeColumnModel.data_columns
    columns.should include({:name => 'test', :type => 'number'})
  end

  it "should create model with polygon type geometry columns" do
    columns = PolygonGeometryModel.data_columns
    columns.should have(4).items
    columns.should include({:name => 'the_geom',       :type => 'geometry', :geometry_type => 'multipolygon'})
    columns.should include({:name => 'another_column', :type => 'string'})
  end

  it "should create model with geometry type geometry columns" do
    columns = GeometryGeometryModel.data_columns
    columns.should have(4).items
    columns.should include({:name => 'the_geom',       :type => 'geometry', :geometry_type => 'geometry'})
    columns.should include({:name => 'another_column', :type => 'string'})
  end
end
