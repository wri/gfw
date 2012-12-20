module CartoDB
  module Client
    module Connection
      class CartoDBConnection
        include OAuth::RequestProxy::Typhoeus
        include CartoDB::Client::Authorization
        include CartoDB::Client::Utils
        include CartoDB::Helpers::SqlHelper

        VERSION = 'v1'.freeze

        def initialize(connection_settings)
          @hydra = Typhoeus::Hydra.new(:max_concurrency => 200)
        end

        def create_table(table_name = nil, schema_or_file = nil, the_geom_type = 'Point')

          params = {:name => table_name}
          params[:the_geom_type] = the_geom_type.downcase if the_geom_type.present?

          case schema_or_file

          when String

            params[:the_geom_type] = schema_or_file.downcase

            request = cartodb_request 'tables', :post, :params => params do |response|
              return Utils.parse_json(response)
            end

          when Array

            schema = schema_or_file if schema_or_file && schema_or_file.is_a?(Array)
            params[:schema] = schema.map{|s| "#{s[:name]} #{s[:type]}"}.join(', ') if schema

            request = cartodb_request 'tables', :post, :params => params do |response|
              return Utils.parse_json(response)
            end

          when File

            file = schema_or_file if schema_or_file && schema_or_file.is_a?(File)

            request = cartodb_request nil, :post, :url => '/upload', :params => {:file => file}, :multipart => true do |response|
              upload_response = Utils.parse_json(response)

              params = {:name => table_name}
              params[:url]           = generate_url upload_response[:file_uri]
              params[:the_geom_type] = the_geom_type.downcase if the_geom_type.present?

              request = cartodb_request 'tables', :post, :params => params do |response|
                return Utils.parse_json(response)
              end

            end

          else

            request = cartodb_request 'tables', :post, :params => params do |response|
              return Utils.parse_json(response)
            end

          end

          execute_queue

          request.handled_response

        end

        def rename_table(old_table_name, new_table_name)
          request = cartodb_request "tables/#{old_table_name}",
                                    :put,
                                    :params => {
                                      :name => new_table_name
                                    } do |response|
            return Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def add_column(table_name, column_name, column_type)
          cartodb_request "tables/#{table_name}/columns",
                          :post,
                          :params => {
                            :name => column_name,
                            :type => column_type
                          }

          execute_queue
        end

        def drop_column(table_name, column_name)
          cartodb_request "tables/#{table_name}/columns/#{column_name}",
                          :delete

          execute_queue
        end

        def change_column(table_name, old_column_name, new_column_name, column_type)
          cartodb_request "tables/#{table_name}/columns/#{old_column_name}",
                          :put,
                          :params => {
                            :new_name => new_column_name,
                            :type => column_type
                          }

          execute_queue
        end

        def tables
          request = cartodb_request 'tables' do |response|
            return Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def table(table_name)
          request = cartodb_request "tables/#{table_name}" do |response|
            return Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def drop_table(table_name)
          cartodb_request "tables/#{table_name}", :delete

          execute_queue
        end

        def row(table_name, row_id)
          cartodb_request "tables/#{table_name}/records/#{row_id}" do |response|
            return Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def insert_row(table_name, row)
          row = prepare_data(row)

          results = query(<<-SQL
            INSERT INTO #{table_name}
            (#{row.keys.join(',')})
            VALUES (#{row.values.join(',')})
            RETURNING cartodb_id as id, *;
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
            WHERE cartodb_id = #{row_id}
            RETURNING cartodb_id as id, *;
          SQL
          )

          results.rows.first

        end

        def delete_row(table_name, row_id)
          query(<<-SQL
            DELETE FROM #{table_name}
            WHERE cartodb_id = #{row_id}
          SQL
          )
        end

        def records(table_name, options = {})
          request = cartodb_request "tables/#{table_name}/records", :params => options.slice(:rows_per_page, :page) do |response|
            return Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def query(sql, options = {})
          params = {:q => CGI::escape(sql)}

          uri = 'sql'
          uri_params = []

          if options && options.any?
            uri_params << "page=#{options[:page]}"                   if options[:page]
            uri_params << "rows_per_page=#{options[:rows_per_page]}" if options[:rows_per_page]
            uri << "?#{uri_params.join('&')}" if uri_params.any?
          end

          request = cartodb_request uri, :post, :params => params do |response|
            Utils.parse_json(response)
          end

          execute_queue

          request.handled_response
        end

        def cartodb_request(uri, method = :get, arguments = {:params => {}}, &block)
          params = arguments[:params]
          if method.is_a? Hash
            params = method[:params]
            method = :get
          end

          uri = "/api/#{VERSION}/#{uri}"
          url = generate_url uri
          url = generate_url(arguments[:url]) if arguments[:url]

          headers                  = {}
          headers['Accept']        = MIME::Types['application/json']
          headers.merge!(arguments[:headers]) if arguments[:headers]

          request = signed_request(url,
            :method        => method,
            :headers       => headers,
            :params        => params,
            :multipart     => arguments[:multipart],
            :cache_timeout => settings['cache_timeout'],
            :verbose       => settings['debug']
          )

          request.on_complete do |response|
            if response.success?
              yield(response) if block_given?
            else
              raise CartoDB::Client::Error.new url, method, response
            end
          end

          enqueue request
        end
        private :cartodb_request

        def enqueue(request)
          @hydra.queue request
          request
        end
        private :enqueue

        def execute_queue
          @hydra.run
        end
        private :execute_queue

        def generate_url(uri)
          uri = URI.parse("#{settings['host']}#{uri}")
          "#{uri.scheme}://#{uri.host}:#{uri.port}#{uri.path}"
        end
        private :generate_url

        def settings
          CartoDB::Settings || {}
        end
        private :settings

      end
    end
  end
end
