cartoDB Ruby Client [![Build Status](https://secure.travis-ci.org/Vizzuality/cartodb-rb-client.png)](http://travis-ci.org/Vizzuality/cartodb-rb-client)
===================

cartoDB ruby client that allows an easy and simple interaction with the cartoDB API.

Requirements
-------------

The only requirement is an Internet connection and a working version of the Ruby language interpreter. Current ruby versions supported are 1.8.7 and 1.9.2

Setup
------

1. Install the client gem:

        gem install cartodb-rb-client

    or if you are using bundler, put this line in your Gemfile:

        gem 'cartodb-rb-client'

2. Log into http://cartodb.com, and grab your API_KEY or your OAUTH credentials and put them in a YAML file:

    For the API_KEY:

    *cartodb\_config.yml:*

        host: 'YOUR_CARTODB_DOMAIN'
        api_key: 'YOUR_API_KEY'

    For the OAUTH Credentials:

    *cartodb\_config.yml:*

        host: 'YOUR_CARTODB_DOMAIN'
        oauth_key: 'YOUR_OAUTH_KEY'
        oauth_secret: 'YOUR_OAUTH_SECRET'
        oauth_access_token: 'YOUR_OAUTH_ACCES_TOKEN'
        oauth_access_token_secret: 'YOUR_OAUTH_ACCES_TOKEN_SECRET'

    We also support xAuth protocol. In order to use it, provide your username and password instead of your access token:

    *cartodb\_config.yml:*

        host: 'YOUR_CARTODB_DOMAIN'
        oauth_key: 'YOUR_OAUTH_KEY'
        oauth_secret: 'YOUR_OAUTH_SECRET'
        username: 'YOUR_CARTODB_USERNAME'
        password: 'YOUR_CARTODB_PASSWORD'

3. Setup your cartoDB connection object:

        CartoDB::Init.start YAML.load_file(Rails.root.join('config/cartodb_config.yml'))

And that's it. Now you should be able to run querys against the cartoDB servers using the CartoDB::Connection object.

Note: You have to use strings instead of symbols for the configuration hash keys.

Using the cartoDB API
-----------

List of supported methods to interact with cartoDB:

####1. Create table.

Creates a new table in cartoDB. The table's name will be normalized, for example, 'table #1' will become 'table\_1'.

Arguments:

- **table\_name**: table's name.

- **schema_or_file**: this parameter can be a list of fields the table will contain, or a File class containing the data the table will contain. It supports all file types supported by cartoDB.

- **the\_geom\_type**: Type of geometry the\_geom field will have. Currently we only support 'POINT', but we'll support more types soon.

Example 1:

    CartoDB::Connection.create_table 'table #1', [{:name => 'field1', :type => 'text'}], 'POINT'

Results:

    {:id => 1,
     :name => "table_1",
     :schema =>
     [["cartodb_id", "number"],
      ["field1", "string"],
      ["updated_at", "date"],
      ["created_at", "date"]]}

Example 2:

    CartoDB::Connection.create_table 'whs_sites', File.open("#{File.dirname(__FILE__)}/support/whs_features.csv", 'r')

Results:

    {:id=>242,
     :name=>"_20120314_21932_1fx2580whs_features",
     :schema=>
     [["cartodb_id", "number"],
      ["the_geom", "geometry", "geometry", "geometry"],
      ["comments", "string"],
      ["country", "string"],
      ["criteria", "string"],
      ["date_of_inscription", "string"],
      ["description", "string"],
      ["edited_region", "string"],
      ["endangered_reason", "string"],
      ["endangered_year", "string"],
      ["external_links", "string"],
      ["iso_code", "string"],
      ["latitude", "string"],
      ["longitude", "string"],
      ["name", "string"],
      ["region", "string"],
      ["size", "string"],
      ["title", "string"],
      ["type", "string"],
      ["whs_site_id", "string"],
      ["whs_source_page", "string"],
      ["wikipedia_link", "string"],
      ["created_at", "date"],
      ["updated_at", "date"]]}

####2. Add column.

Adds a new column to an existing table.

Arguments:

- **table_name**: table's name.
- **column_name**: new column's name.
- **column_type**: new column's data type. Supported types: string, numeric, date, boolean and geometry.

Example:

    CartoDB::Connection.add\_column 'table_1', 'my_column', 'numeric'

Results:

    []

####3. Drop column.

Removes an existing column in the specified table.

Arguments:

- **table_name**: table's name which column will be dropped.
- **column_name**: name of the column to be dropped.

Example:

    CartoDB::Connection.drop\_column 'table_1', 'my_column'

Results:

    []

####4. Change column.

Changes name and data type of an existing column.

Arguments:

- **table_name**: table's name which column will be changed.
- **old_column_name**: current name of the column to be changed.
- **new_column_name**: new name for the column.
- **column_type**: new data type of the column.

Example:

    CartoDB::Connection.change\_column 'table_1', 'field1', 'myfield', 'boolean'

Results:

    []

####5. List tables.

List all tables in your cartoDB account.

Example:

    CartoDB::Connection.tables

Results:

    {:total_entries => 1,
     :tables =>
     [{:id => 1,
      :name => "table_1",
      :privacy => "PUBLIC",
      :tags => "",
      :schema =>
      [["cartodb_id", "number"],
       ["the_geom", "geometry", "geometry", "geometry"],
       ["field1", "string"],
       ["created_at", "string"],
       ["updated_at", "string"]],
      :updated_at => Mon, 12 Sep 2011 00:00:00 +0000,
      :rows_counted => 1}]}

####6. Table's detail

Shows information about the specified table.

Arguments:

- **table_name**: Name of the table you want to get info.

Example:

    CartoDB::Connection.table 'table_1'

Results:

    {:id => 1,
     :name => "table_1",
     :privacy => "PRIVATE",
     :tags => "",
     :schema =>
     [["cartodb_id", "number"],
      ["myfield", "boolean"],
      ["updated_at", "date"],
      ["created_at", "date"]]}

####7. Drop table.

Deletes the specified table.

Arguments:

- **table_name**: Name of the table to delete.

Example:

    CartoDB::Connection.drop_table 'table_1'

Results:

    []

####8. Get single row.

You can get a single row with this method by specifying its cartodb_id.

Arguments:

- **table_name**: Name of the table.
- **row_id**: Id of the row we want.

Example:

    CartoDB::Connection.row 'table_1', 1

Result:

    {:id => 1,
     :updated_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :created_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :cartodb_id => 1,
     :field1 => "cartoDB is awesome!"}


####9. Insert row.

Inserts a new row in the specified table.

Arguments:

- **table_name**: Name of the table.
- **row**: A ruby hash with the name of the columns we want to insert
  data in, and its values.

Example:

    CartoDB::Connection.insert_row 'table_1', :field1 => 'cartoDB is
awesome!'

Results:

    {:id => 1,
     :updated_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :created_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :cartodb_id => 1,
     :field1 => "cartoDB is awesome!"}

####10. Update row.

Updates a single row in the specified table.

Arguments:

- **table_name**: Name of the table.
- **row_id**: Id of the row we want to update.
- **row**: A ruby hash containing the column names and values for the
  update.

Example:

    CartoDB::Connection.update_row 'table_1', 1, :field1 => 'cartoDB is
*really* awesome!'

Result:

    {:id => 1,
     :updated_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :created_at => Tue, 13 Sep 2011 00:00:00 +0000,
     :cartodb_id => 1,
     :field1 => "cartoDB is *really* awesome!"}

####11. Delete row.

Deletes a row in the specified table.

Arguments:

- **table_name**: Name of the table.
- **row_id**: Id of the row we want to delete.

Example:

    CartoDB::Connection.delete_row 'table_1', 1

Result:

    {:time => 0.008, :total_rows => 0, :rows => []}

####12. Execute a sql query.

Executes an sql query against your database in cartoDB.

Arguments:

- **sql**: String containing the query we want to execute.
- **options**: A ruby hash containing optional params to run the query.
  Currently we support pagination using the :page and :rows_per_page
parameters in the options argument.

Example:

    # At first, lets introduce some dummy data for the test
    10.times{ CartoDB::Connection.insert_row 'table_1', :field1 => 'cartoDB is awesome!'}

    # And now, the query itself
    CartoDB::Connection.query 'SELECT * FROM table_1', :page => 1,
:rows_per_page => 5

Results:

    {:time=>0.017,
     :total_rows=>10,
     :rows=>[{:updated_at=>Tue, 13 Sep 2011 00:00:00 +0000,
              :created_at=>Tue, 13 Sep 2011 00:00:00 +0000,
              :cartodb_id=>2,
              :field1=>"cartoDB is awesome!"},
              ...
              ]}

More info
---------

You can also check the oficial [cartoDB Documentation](http://developers.cartodb.com/) if you want more info about the cartoDB API.


