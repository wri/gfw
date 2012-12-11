# coding: UTF-8
require 'spec_helper'

describe 'CartoDB client', :vcr => true do

  it "should create a table and get its table definition" do

    table = CartoDB::Connection.create_table 'cartodb_spec'

    table.should_not be_nil
    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should have(6).items
    table.schema.should include(["cartodb_id", "number"])
    table.schema.should include(["created_at", "date"])
    table.schema.should include(["updated_at", "date"])
    table.schema.should include(["name", "string"])
    table.schema.should include(["description", "string"])
    table.schema.should include(["the_geom", "geometry", "geometry", "geometry"])
  end

  it "should create a table forcing the schema and get its table definition" do
    table = CartoDB::Connection.create_table 'cartodb_spec', [
      {:name => 'field1', :type => 'text'},
      {:name => 'field2', :type => 'numeric'},
      {:name => 'field3', :type => 'date'},
      {:name => 'field4', :type => 'boolean'}
    ]

    table.should_not be_nil
    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should have(7).items
    table.schema.should include(["cartodb_id", "number"])
    table.schema.should include(["created_at", "date"])
    table.schema.should include(["updated_at", "date"])
    table.schema.should include(["field1", "string"])
    table.schema.should include(["field2", "number"])
    table.schema.should include(["field3", "date"])
    table.schema.should include(["field4", "boolean"])
  end

  it "should create a table from a csv file" do

    table = CartoDB::Connection.create_table 'whs_sites', File.open("#{File.dirname(__FILE__)}/support/whs_features.csv", 'r')

    table.should_not be_nil
    table[:id].should be > 0
    table = CartoDB::Connection.table table[:name]
    table.schema.should have(24).items

    records = CartoDB::Connection.records table[:name]
    records.should_not be_nil
    records.rows.should have(10).whs_sites

    records.rows.first.cartodb_id.should be > 0
    records.rows.first.title.should be == "Aflaj Irrigation Systems of Oman"
    records.rows.first.the_geom.x.should be > 0
    records.rows.first.the_geom.y.should be > 0
    records.rows.first.description.should match /A qanāt \(from Arabic: قناة‎\) \(Iran, Syria and Jordan\) is a water management system used to provide/
    records.rows.first.region.should be == "Dakhiliya, Sharqiya and Batinah Regions"
    records.rows.first.type.should be == "cultural"
    records.rows.first.endangered_reason.should be_empty
    records.rows.first.edited_region.should be == "Dakhiliya, Sharqiya and Batinah Regions"
    records.rows.first.endangered_year.should be_empty
    records.rows.first.external_links.should_not be_empty
    records.rows.first.wikipedia_link.should be == "http://en.wikipedia.org/wiki/Qanat"
    records.rows.first.comments.should be_empty
    records.rows.first.criteria.should be == "[v]"
    records.rows.first.iso_code.should be == "OM"
    records.rows.first.size.should be == 14560000.0
    records.rows.first.name.should be == "Aflaj Irrigation Systems of Oman"
    records.rows.first.country.should be == "Oman"
    records.rows.first.whs_site_id.should be == 1207
    records.rows.first.date_of_inscription.should be == 2006
    records.rows.first.whs_source_page.should be == "http://whc.unesco.org/en/list/1207"
    records.rows.first.created_at.should_not be_nil
    records.rows.first.updated_at.should_not be_nil

  end

  it "should import any kind of data file" do
    Dir["#{File.dirname(__FILE__)}/support/data/*"].each do |file|
      table = CartoDB::Connection.create_table File.basename(file, '.*'), File.open(file, 'r')

      table.should_not be_nil
      table[:id].should be > 0
      table[:name].should_not be_empty
    end
  end

  it "should create a table with GEOMETRY type geometry" do
    table = CartoDB::Connection.create_table 'cartodb_spec'

    table.should_not be_nil
    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should have(6).items
    table.schema.should include(["cartodb_id", "number"])
    table.schema.should include(["created_at", "date"])
    table.schema.should include(["updated_at", "date"])
    table.schema.should include(["name", "string"])
    table.schema.should include(["description", "string"])
    table.schema.should include(["the_geom", "geometry", "geometry", "geometry"])
  end

  it "should rename an existing table" do
    table = CartoDB::Connection.create_table 'cartodb_spec'

    table.name.should be == 'cartodb_spec'

    table = CartoDB::Connection.rename_table 'cartodb_spec', 'renamed_cartodb_spec'
    table.name.should be == 'renamed_cartodb_spec'
  end

  it "should add and remove colums in a previously created table" do
    CartoDB::Connection.create_table 'cartodb_spec'
    CartoDB::Connection.add_column 'cartodb_spec', 'field1', 'text'
    CartoDB::Connection.add_column 'cartodb_spec', 'field2', 'numeric'
    CartoDB::Connection.add_column 'cartodb_spec', 'field3', 'date'

    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should have(9).items
    table.schema.should include(["field1", "string"])
    table.schema.should include(["field2", "number"])
    table.schema.should include(["field3", "date"])

    CartoDB::Connection.drop_column 'cartodb_spec', 'field3'
    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should have(8).items
    table.schema.should_not include(["field3", "date"])
  end

  it "should change a previously created column" do
    CartoDB::Connection.create_table 'cartodb_spec', [{:name => 'field1', :type => 'text'}]
    CartoDB::Connection.change_column 'cartodb_spec', "field1", "changed_field", "numeric"
    table = CartoDB::Connection.table 'cartodb_spec'
    table.schema.should_not include(["field1", "string"])
    table.schema.should include(["changed_field", "number"])
  end

  it "should return user's table list" do
    table_1 = CartoDB::Connection.create_table 'table #1'
    table_2 = CartoDB::Connection.create_table 'table #2'

    tables_list = CartoDB::Connection.tables
    tables_list.tables.should have(2).items
    tables_list.tables.map(&:name).should include(table_1.name)
    tables_list.tables.map(&:name).should include(table_2.name)
  end

  it "should drop a table" do
    table_1 = CartoDB::Connection.create_table 'table #1'
    table_2 = CartoDB::Connection.create_table 'table #2'
    table_3 = CartoDB::Connection.create_table 'table #3'

    CartoDB::Connection.drop_table 'table_2'

    tables_list = CartoDB::Connection.tables
    tables_list.tables.should have(2).items
    tables_list.tables.map(&:name).should include(table_1.name)
    tables_list.tables.map(&:name).should include(table_3.name)
  end

  it "should insert a row in a table" do
    table = CartoDB::Connection.create_table 'table #1', [
      {:name => 'field1', :type => 'text'},
      {:name => 'field2', :type => 'numeric'},
      {:name => 'field3', :type => 'date'},
      {:name => 'field4', :type => 'boolean'}
    ]

    today = DateTime.new(2004, 1, 1)

    record = CartoDB::Connection.insert_row 'table_1', {
      'field1'      => 'lorem',
      'field2'      => 100.99,
      'field3'      => today,
      'field4'      => true
    }

    record.field1.should         == 'lorem'
    record.field2.should         == 100.99
    record.field3.to_date.should == today.to_date
    record.field4.should         == true
  end

  it "should update a row in a table" do
    table = CartoDB::Connection.create_table 'table #1', [
      {:name => 'field1', :type => 'text'},
      {:name => 'field2', :type => 'numeric'},
      {:name => 'field3', :type => 'date'},
      {:name => 'field4', :type => 'boolean'}
    ]

    today = DateTime.new(2004, 1, 1)

    record = CartoDB::Connection.insert_row 'table_1', {
      'field1'      => 'lorem',
      'field2'      => 100.99,
      'field3'      => today,
      'field4'      => true
    }

    record = CartoDB::Connection.update_row 'table_1', record.id, {
      'field1'      => 'illum',
      'field2'      => -83.24,
      'field3'      => today + 1,
      'field4'      => false
    }

    record.field1.should      == 'illum'
    record.field2.should      == -83.24
    record.field3.to_date.should == (today + 1).to_date
    record.field4.should      == false
  end

  it "should delete a table's row" do
    table = CartoDB::Connection.create_table 'table #1', [
      {:name => 'field1', :type => 'text'},
      {:name => 'field2', :type => 'numeric'},
      {:name => 'field3', :type => 'date'},
      {:name => 'field4', :type => 'boolean'}
    ]

    today = Time.now

    record = CartoDB::Connection.insert_row 'table_1', {
      'field1'      => 'lorem',
      'field2'      => 100.99,
      'field3'      => today,
      'field4'      => true
    }

    CartoDB::Connection.delete_row 'table_1', record.id

    records = CartoDB::Connection.records 'table_1'

    records.name.should be == 'table_1'
    records.total_rows.should == 0
    records.rows.should be_empty
  end

  it "should execute a select query and return results" do
    table = CartoDB::Connection.create_table 'table #1'

    10.times do
      row = CartoDB::Connection.insert_row 'table_1', {
        'name'        => String.random(15),
        'description' => String.random(200),
        'the_geom'    => RgeoFactory.point(-3.69962, 40.42222)
      }

    end
    results = CartoDB::Connection.query("SELECT * FROM table_1")
    results.should_not be_nil
    results.time.should be > 0
    results.total_rows.should == 10
    results.rows.should have(10).items
    results.rows.each do |row|
      row.cartodb_id.should be > 0
      row.name.should_not be_empty
      row.the_geom.y.should be == 40.42222
      row.the_geom.x.should be == -3.69962
      row.description.should_not be_empty
      row.created_at.should_not be_nil
      row.updated_at.should_not be_nil
    end
  end

  it "should get a table by its name" do
    created_table = CartoDB::Connection.create_table 'table_with_name'

    table = CartoDB::Connection.table 'table_with_name'
    table.should_not be_nil
    table.name.should be == created_table.name
  end

  it "should return nil when requesting a table which does not exists" do
    expect{CartoDB::Connection.table('non_existing_table')}.to raise_error(CartoDB::Client::Error)
  end

  it "should return errors on invalid queries" do
    expect{results = CartoDB::Connection.query("SELECT 1 FROM non_existing_table")}.to raise_error(CartoDB::Client::Error, /relation "non_existing_table" does not exist/)
  end

  it "should paginate records" do
    table = CartoDB::Connection.create_table 'table #1'

    50.times do
      CartoDB::Connection.insert_row 'table_1', {
        'name'        => String.random(15),
        'description' => String.random(200),
        'the_geom'    => RgeoFactory.point(rand(180), rand(90))
      }
    end

    records = CartoDB::Connection.records 'table_1', :page => 0, :rows_per_page => 20
    records.total_rows.should be == 50
    records.rows.should have(20).records
    records.rows.first.cartodb_id.should be == 1
    records.rows.last.cartodb_id.should be == 20

    records = CartoDB::Connection.records 'table_1', :page => 1, :rows_per_page => 20
    records.total_rows.should be == 50
    records.rows.should have(20).records
    records.rows.first.cartodb_id.should be == 21
    records.rows.last.cartodb_id.should be == 40

  end

  it 'should escape properly input data in insert queries' do

    table = CartoDB::Connection.create_table 'table #1', 'multipolygon'
    table.schema.should include(["the_geom", "geometry", "geometry", "multipolygon"])

    record = CartoDB::Connection.insert_row 'table_1', {
      'the_geom' => "ST_GeomFromText('MULTIPOLYGON(((95.67764648436992 59.894444919406,90.75577148436992 54.16886220825434,103.41202148436992 56.75874227547269,95.67764648436992 59.894444919406)))', 4326)"
    }

    record.id.should_not be_nil
  end

  it 'should allow reserved words in columns names' do
    table = CartoDB::Connection.create_table 'table #1', [{:name => 'class', :type => 'text'}]
    table.schema.should include(["class", "string"])

    record = CartoDB::Connection.insert_row table.name, :class => 'wadus'
    record.class_.should == 'wadus'
  end

end
