module Fog
  module Rackspace
    module Errors
      def self.included(mod)
        mod.class_eval <<-'EOS', __FILE__, __LINE__
        class NotFound < Fog::Service::NotFound
          attr_reader :region, :status_code, :transaction_id

          def to_s
            status = status_code ? "HTTP #{status_code}" : "HTTP <Unknown>"
            message = region ? "resource not found in #{region} region" : super
            "[#{status} | #{transaction_id}] #{message}"
          end

          def self.slurp(error, service=nil)
            exception = NotFound.new
            exception.instance_variable_set(:@region, service.region) if service && service.respond_to?(:region)
            exception.instance_variable_set(:@status_code, error.response.status) rescue nil
            exception.set_transaction_id(error, service)
            exception
          end

          def set_transaction_id(error, service)
            return unless service && service.respond_to?(:request_id_header) && error.response
            @transaction_id = error.response.headers[service.request_id_header]
          end

        end
        EOS
      end

      class ServiceError < Fog::Errors::Error
        attr_reader :response_data, :status_code, :transaction_id

        def to_s
          status = status_code ? "HTTP #{status_code}" : "HTTP <Unknown>"
          "[#{status} | #{transaction_id}] #{super}"
        end

        def self.slurp(error, service=nil)
          data = nil
          message = nil
          status_code = nil

          if error.response
            status_code = error.response.status
            unless error.response.body.empty?
              begin
                data = Fog::JSON.decode(error.response.body)
                message = extract_message(data)
              rescue  => e
                Fog::Logger.warning("Received exception '#{e}' while decoding>> #{error.response.body}")
                message = error.response.body
                data = error.response.body
              end
            end
          end

          new_error = super(error, message)
          new_error.instance_variable_set(:@response_data, data)
          new_error.instance_variable_set(:@status_code, status_code)
          new_error.set_transaction_id(error, service)
          new_error
        end

        def set_transaction_id(error, service)
          return unless service && service.respond_to?(:request_id_header) && error.response
          @transaction_id = error.response.headers[service.request_id_header]
        end

        def self.extract_message(data)
          if data.is_a?(Hash)
            message = data.values.first['message'] if data.values.first.is_a?(Hash)
            message ||= data['message']
          end
          message || data.inspect
        end
      end

      class InternalServerError < ServiceError; end
      class Conflict < ServiceError; end
      class ServiceUnavailable < ServiceError; end
      class MethodNotAllowed < ServiceError; end
      class BadRequest < ServiceError
        attr_reader :validation_errors

        def to_s
          "#{super} - #{validation_errors}"
        end

        def self.slurp(error, service=nil)
          new_error = super(error)
          unless new_error.response_data.nil? or new_error.response_data['badRequest'].nil?
            new_error.instance_variable_set(:@validation_errors, new_error.response_data['badRequest']['validationErrors'])
          end

          status_code = error.response ? error.response.status : nil
          new_error.instance_variable_set(:@status_code, status_code)
          new_error.set_transaction_id(error, service)
          new_error
        end
      end
    end
  end
end
