module CartoDB
  module Client
    module Connection
      class PostgreSQL
        include CartoDB::Helpers::SqlHelper

        DATA_TYPES_TRANSLATION_TABLE = {
          'int4'      => 'number',
          'numeric'   => 'number',
          'text'      => 'string',
          'varchar'   => 'string',
          'date'      => 'date',
          'timestamp' => 'date',
          'bool'      => 'boolean',
          'geometry'  => 'geometry'
        }

        def initialize(connection_settings)
          @pg = connect_to_postgres(connection_settings)
        end

        def connect_to_postgres(settings)
          pg_connection = PGconn.open(
            :host     => settings['host'],
            :port     => settings['port'],
            :user     => settings['user'],
            :password => settings['password'],
            :dbname   => settings['database']
          )
          pg_connection.set_notice_processor{|message| nil}
          pg_connection
        end
        private :connect_to_postgres

        def create_table(table_name = nil, schema_or_file = nil, the_geom_type = 'Point')
          schema = schema_or_file if schema_or_file && schema_or_file.is_a?(Array)
          file   = schema_or_file if schema_or_file && schema_or_file.is_a?(File)

          params = {:name => table_name}
          params[:file] = file if file

          table_name = table_name.sanitize

          if schema.nil? || schema.empty?
            schema = []
            schema << {:name => 'name',        :type => 'text'} if schema.select{|c| c[:name].eql?('name')}.empty?
            schema << {:name => 'description', :type => 'text'} if schema.select{|c| c[:name].eql?('description')}.empty?
            create_the_geom = "SELECT AddGeometryColumn('public', '#{table_name}', 'the_geom', 4326, 'POINT', 2)"
          end

          schema << {:name => 'cartodb_id',  :type => 'serial',    :extra => 'NOT NULL'}                                                                 if schema.select{|c| c[:name].eql?('cartodb_id')}.empty?
          schema << {:name => 'created_at',  :type => 'timestamp', :extra => 'without time zone DEFAULT current_timestamp::timestamp without time zone'} if schema.select{|c| c[:name].eql?('created_at')}.empty?
          schema << {:name => 'updated_at',  :type => 'timestamp', :extra => 'without time zone DEFAULT current_timestamp::timestamp without time zone'} if schema.select{|c| c[:name].eql?('updated_at')}.empty?
          if schema.any? && schema.select{|c| c[:name].downcase.match(/geo/)}.any?
            the_geom_field = schema.select{|c| c[:name].downcase.match(/geo/)}.first
            create_the_geom = "SELECT AddGeometryColumn('public', '#{table_name}', 'the_geom', 4326, '#{the_geom_field[:geometry_type].upcase}', 2)"
            schema.reject!{|c| c[:name].downcase.match(/geo/)}
          end

          @pg.query(<<-SQL
            CREATE TABLE #{table_name}
            (
              #{schema.map{|s| "#{s[:name]} #{s[:type]} #{s[:extra]}"}.join(', ')}
            )
            WITH (
              OIDS=FALSE
            );
            ALTER TABLE #{table_name} OWNER TO #{@pg.user};
          SQL
          )

          @pg.query(create_the_geom) if create_the_geom

          table table_name
        end

        def add_column(table_name, column_name, column_type)
          @pg.query(<<-SQL
            ALTER TABLE #{table_name} ADD COLUMN #{column_name} #{column_type};
          SQL
          )
        end

        def drop_column(table_name, column_name)
          @pg.query(<<-SQL
            ALTER TABLE #{table_name} DROP COLUMN #{column_name};
          SQL
          )
        end

        def change_column(table_name, old_column_name, new_column_name, column_type)
          add_column table_name, new_column_name, column_type
          @pg.query(<<-SQL
            UPDATE #{table_name} SET #{new_column_name}=cast(#{old_column_name} as #{column_type})
          SQL
          )
          drop_column table_name, old_column_name
        end

        def tables
          pg_result = @pg.query(<<-SQL
            SELECT columns.table_name, columns.column_name, columns.udt_name as data_type
            FROM information_schema.tables tables
            INNER JOIN information_schema.columns columns ON columns.table_name = tables.table_name
            WHERE tables.table_schema = 'public' AND tables.table_name not IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns')
          SQL
          )

          result = CartoDB::Types::Metadata.new
          tables = {}
          pg_result.each do |column|
            tables[column['table_name']] = CartoDB::Types::Metadata.from_hash({:name => column['table_name'], :schema => []}) unless tables[column['table_name']]
            tables[column['table_name']].schema << %W(#{column['column_name']} #{CartoDB::Client::Connection::PostgreSQL::DATA_TYPES_TRANSLATION_TABLE[column['data_type']]})
          end

          result.total_entries = tables.to_a.length
          result.tables = tables.to_a.map(&:last)
          result
        end

        def table(table_name)
          pg_result = @pg.query(<<-SQL
            SELECT columns.table_name, columns.column_name, columns.udt_name as data_type, geo_cols.type as geometry_type
            FROM information_schema.tables tables
            INNER JOIN information_schema.columns columns ON columns.table_name = tables.table_name
            LEFT OUTER JOIN public.geometry_columns geo_cols ON geo_cols.f_table_schema = columns.table_schema AND geo_cols.f_table_name = columns.table_name AND geo_cols.f_geometry_column = columns.column_name
            WHERE tables.table_schema = 'public' AND tables.table_name not IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns') AND tables.table_name ilike '#{table_name}'
          SQL
          )

          if pg_result.to_a.empty?
            non_existing_table = @pg.query(<<-SQL
              SELECT tables.table_name
              FROM information_schema.tables tables
              WHERE tables.table_schema = 'public' AND tables.table_name not IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns') AND tables.table_name ilike '#{table_name}'
            SQL
            )
            raise CartoDB::Client::Error.new if non_existing_table.to_a.empty?
          end

          table_result = nil
          pg_result.each do |column|
            table_result = CartoDB::Types::Metadata.from_hash({:name => column['table_name'], :schema => []}) unless table_result
            table_result.schema << %W(#{column['column_name']} #{CartoDB::Client::Connection::PostgreSQL::DATA_TYPES_TRANSLATION_TABLE[column['data_type']]})
            table_result.schema.last << CartoDB::Client::Connection::PostgreSQL::DATA_TYPES_TRANSLATION_TABLE[column['data_type']]  if column['geometry_type']
            table_result.schema.last << column['geometry_type'].downcase if column['geometry_type']
          end
          table_result
        end

        def drop_table(table_name)
          @pg.query(<<-SQL
            DROP TABLE #{table_name}
          SQL
          )
        end

        def row(table_name, row_id)
          results = query(<<-SQL
            SELECT #{table_name}.cartodb_id as id, #{table_name}.*
            FROM #{table_name}
            WHERE cartodb_id = #{row_id};
          SQL
          )

          results.rows.first
        end

        def insert_row(table_name, row)
          row = prepare_data(row)

          results = query(<<-SQL
            INSERT INTO #{table_name}
            (#{row.keys.join(',')})
            VALUES (#{row.values.join(',')});

            SELECT #{table_name}.cartodb_id as id, #{table_name}.*
            FROM #{table_name}
            WHERE cartodb_id = currval('public.#{table_name}_cartodb_id_seq');
          SQL
          )

          results.rows.first
        end

        def update_row(table_name, row_id, row)
          row = prepare_data(row)

          results = query(<<-SQL
            UPDATE #{table_name}
            SET (#{row.keys.join(',')})
            = (#{row.values.join(',')})
            WHERE cartodb_id = #{row_id};
            SELECT #{table_name}.cartodb_id as id, #{table_name}.*
            FROM #{table_name}
            WHERE cartodb_id = currval('public.#{table_name}_cartodb_id_seq');
          SQL
          )

          results.rows.first
        end

        def delete_row(table_name, row_id)
          @pg.query(<<-SQL
            DELETE FROM #{table_name}
            WHERE cartodb_id = #{row_id}
          SQL
          )
        end

        def records(table_name, options = {})
          sql = <<-SQL
            SELECT #{table_name}.cartodb_id AS id, #{table_name}.*
            FROM #{table_name}
          SQL

          results = query(sql, options)

          results[:name] = table_name
          results
        end

        def query(sql, options = {})
          sql = sql.strip if sql

          if sql.include?('*')
            table_name = sql.match(/select(.*)\s((\w+\.)?\*)(.*)from\s+(\w*)[^;]*;?/im)[5]
            schema = table(table_name).schema if table_name

            sql.gsub!(/^select(.*)\s((\w+\.)?\*)(.*)from/im) do |matches|
              %Q{SELECT #{$1.strip} #{schema.map{|c| "#{$3}#{c[0]}"}.join(', ')} #{$4.strip} FROM}
            end
          end

          crono = Time.now
          begin
            result = @pg.query(<<-SQL
              #{sql}
            SQL
            )
          rescue PGError => e
            raise CartoDB::Client::Error.new(nil, nil, nil, e.message)
          end

          CartoDB::Types::Metadata.from_hash({
            :time => Time.now - crono,
            :total_rows => result.cmd_tuples,
            :rows       => result.map{|row| CartoDB::Types::Metadata.from_hash(row)}
          })
        end

      end
    end
  end
end