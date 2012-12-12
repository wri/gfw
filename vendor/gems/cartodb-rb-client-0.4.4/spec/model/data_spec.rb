require 'model_specs_helper'

describe 'CartoDB model data methods', :vcr => true do

  it "should initialize attributes of the model without persisting them" do

    losail_circuit = new_circuit

    records = CartoDB::Connection.records 'moto_gp_circuit'
    records.total_rows.should == 0
    records.rows.should be_empty

    losail_circuit.name.should be == 'Losail Circuit'
    losail_circuit.description.should be == 'The fabulous Losail International Circuit lies on the outskirts of Doha, the capital city of Qatar. Built in little over a year, the track cost $58 million USD and required round-the-clock dedication from almost 1,000 workers in order to get it ready for the inaugural event - the Marlboro Grand Prix of Qatar on the 2nd October 2004.'
    losail_circuit.the_geom.y.should be == 25.488840
    losail_circuit.the_geom.x.should be == 51.453352
    losail_circuit.length.should be == '5380m'
    losail_circuit.width.should be == '12m'
    losail_circuit.left_corners.should be == 6
    losail_circuit.right_corners.should be == 10
    losail_circuit.longest_straight.should be == '1068m'
    losail_circuit.constructed.should be == Date.new(2004, 1, 1)
    losail_circuit.modified.should be == Date.new(2004, 1, 1)
  end

  it "should persist into cartodb using the save method" do
    losail_circuit = new_circuit

    expect {
      losail_circuit.save.should be_true
    }.to change{CartoDB::Connection.records('moto_gp_circuit').total_rows}.from(0).to(1)

    record = CartoDB::Connection.row 'moto_gp_circuit', losail_circuit.cartodb_id
    record.cartodb_id.should       be == 1
    record.name.should             be == 'Losail Circuit'
    record.description.should      match /The fabulous Losail International Circuit lies/
    record.the_geom.y.should         be == 25.488840
    record.the_geom.x.should        be == 51.453352
    record.length.should           be == '5380m'
    record.width.should            be == '12m'
    record.left_corners.should     be == 6
    record.right_corners.should    be == 10
    record.longest_straight.should be == '1068m'
    record.constructed.should      be == DateTime.new(2004, 1, 1)
    record.modified.should         be == DateTime.new(2004, 1, 1)

    losail_circuit.cartodb_id.should be == 1
    losail_circuit.name.should be == 'Losail Circuit'
    losail_circuit.description.should be == 'The fabulous Losail International Circuit lies on the outskirts of Doha, the capital city of Qatar. Built in little over a year, the track cost $58 million USD and required round-the-clock dedication from almost 1,000 workers in order to get it ready for the inaugural event - the Marlboro Grand Prix of Qatar on the 2nd October 2004.'
    losail_circuit.the_geom.y.should be == 25.488840
    losail_circuit.the_geom.x.should be == 51.453352
    losail_circuit.length.should be == '5380m'
    losail_circuit.width.should be == '12m'
    losail_circuit.left_corners.should be == 6
    losail_circuit.right_corners.should be == 10
    losail_circuit.longest_straight.should be == '1068m'
    losail_circuit.constructed.should be == Date.new(2004, 1, 1)
    losail_circuit.modified.should be == Date.new(2004, 1, 1)
  end

  it "should persist into cartodb using the static create method" do
    losail_circuit = MotoGPCircuit.create new_losail_circuit_attributes

    record = CartoDB::Connection.row 'moto_gp_circuit', losail_circuit.cartodb_id
    record.cartodb_id.should             be == 1
    record.name.should             be == 'Losail Circuit'
    record.description.should      match /The fabulous Losail International Circuit lies/
    record.the_geom.y.should         be == 25.488840
    record.the_geom.x.should        be == 51.453352
    record.length.should           be == '5380m'
    record.width.should            be == '12m'
    record.left_corners.should     be == 6
    record.right_corners.should    be == 10
    record.longest_straight.should be == '1068m'
    record.constructed.should be == Date.new(2004, 1, 1)
    record.modified.should    be == Date.new(2004, 1, 1)

    losail_circuit.cartodb_id.should be == 1
    losail_circuit.name.should be == 'Losail Circuit'
    losail_circuit.description.should be == 'The fabulous Losail International Circuit lies on the outskirts of Doha, the capital city of Qatar. Built in little over a year, the track cost $58 million USD and required round-the-clock dedication from almost 1,000 workers in order to get it ready for the inaugural event - the Marlboro Grand Prix of Qatar on the 2nd October 2004.'
    losail_circuit.the_geom.y.should be == 25.488840
    losail_circuit.the_geom.x.should be == 51.453352
    losail_circuit.length.should be == '5380m'
    losail_circuit.width.should be == '12m'
    losail_circuit.left_corners.should be == 6
    losail_circuit.right_corners.should be == 10
    losail_circuit.longest_straight.should be == '1068m'
    losail_circuit.constructed.should be == Date.new(2004, 1, 1)
    losail_circuit.modified.should be == Date.new(2004, 1, 1)
  end

  it "should update an existing record" do
    losail_circuit = MotoGPCircuit.create new_losail_circuit_attributes

    losail_circuit.name        = 'Prueba'
    losail_circuit.description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    losail_circuit.the_geom    = RgeoFactory.point(-3.994131, 40.582394)
    losail_circuit.length      = '1243m'

     expect {
      losail_circuit.save
    }.to change{CartoDB::Connection.records('moto_gp_circuit').total_rows}.by(0)


    record = CartoDB::Connection.row 'moto_gp_circuit', losail_circuit.cartodb_id
    record.cartodb_id.should  be ==  1
    record.name.should        be ==  'Prueba'
    record.description.should match  /Lorem ipsum dolor sit amet, consectetur adipisicing elit/
    record.the_geom.y.should  be ==  40.582394
    record.the_geom.x.should  be ==  -3.994131
    record.length.should      be ==  '1243m'

    losail_circuit.name.should be == 'Prueba'
    losail_circuit.description.should match /Lorem ipsum dolor sit amet, consectetur adipisicing elit/
    losail_circuit.the_geom.y.should be == 40.582394
    losail_circuit.the_geom.x.should be == -3.994131
    losail_circuit.length.should be == '1243m'
  end

  it "should destroy a previously created record" do
    losail_circuit = MotoGPCircuit.create new_losail_circuit_attributes

     expect {
      losail_circuit.destroy
    }.to change{CartoDB::Connection.records('moto_gp_circuit').total_rows}.by(-1)

  end

  it "should save polygons in different formats" do
    polygon_json = '{"type":"MultiPolygon","coordinates":[[[[-3.779297,32.249974],[-8.525391,26.588527],[-2.021484,20.303418],[9.228516,23.563987],[6.943359,29.688053],[5.712891,32.546813]]]]}'

    polygon_model = PolygonGeometryModel.new
    polygon_model.the_geom = polygon_json
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))
    expect {
      polygon_model.save.should be_true
    }.to change{CartoDB::Connection.records('polygon_geometry_model').total_rows}.by(1)
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))

    polygon_model = PolygonGeometryModel.new(:the_geom => polygon_json)
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))
    expect {
      polygon_model.save.should be_true
    }.to change{CartoDB::Connection.records('polygon_geometry_model').total_rows}.by(1)
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))

    polygon_model = PolygonGeometryModel.new(:the_geom => ::JSON.parse(polygon_json))
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))
    expect {
      polygon_model.save.should be_true
    }.to change{CartoDB::Connection.records('polygon_geometry_model').total_rows}.by(1)
    polygon_model.the_geom.should eql(RGeo::GeoJSON.decode(polygon_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))

  end

  it "should save geometries in different formats" do
    geometry_json = '{"type":"Geometry","coordinates":[[[[-3.779297,32.249974],[-8.525391,26.588527],[-2.021484,20.303418],[9.228516,23.563987],[6.943359,29.688053],[5.712891,32.546813]]]]}'

    geometry_model = GeometryGeometryModel.new
    geometry_model.the_geom = geometry_json
    geometry_model.the_geom.should eql(RGeo::GeoJSON.decode(geometry_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))
    expect {
      geometry_model.save.should be_true
    }.to change{CartoDB::Connection.records('geometry_geometry_model').total_rows}.by(1)
    geometry_model.the_geom.should eql(RGeo::GeoJSON.decode(geometry_json, :json_parser => :json, :geo_factory => RGeo::Geographic.spherical_factory(:srid => 4326)))

  end

end
