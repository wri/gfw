module Fog
  module Ecloud
    # Custom errors specific to our implementation
    module Errors
      # The parent class for all errors in the Fog::Compute::Ecloud module.
      class ServiceError < Fog::Errors::Error
        # @!attribute [r] response_data
        #   @return [string] the response from the HTTP request

        # @!attribute [r] status_code
        #   @return [Integer] the HTTP status code returned
        attr_reader :response_data, :status_code, :minor_error_code

        # Make the HTTP status code pretty
        #
        # @return [String] the cleaned up status code
        def to_s
          status = status_code ? "HTTP #{status_code}" : "HTTP <Unknown>"
          minor_code = minor_error_code ? minor_error_code : "Unknown"
          "[#{status} - #{minor_code}] #{super}"
        end

        # Parse the response from the HTTP request to create a user friendly
        #   message, including HTTP response code and error message (if any)
        #
        # @param [Object] error the error object from the rescue block
        #
        # @return [Object] the new error object
        def self.slurp(error)
          data = nil
          message = nil
          status_code = nil
          minor_code = nil

          if error.response
            status_code = error.response.status
            unless error.response.body.empty?
              begin
                document = Fog::ToHashDocument.new
                parser = Nokogiri::XML::SAX::PushParser.new(document)
                parser << error.response.body
                parser.finish

                data = document.body

                message = extract_message(data)
                minor_code = extract_minor_code(data)

              rescue => e
                Fog::Logger.warning("Received exception '#{e}' while decoding: #{error.response.body}")
                message = error.response.body
                data = error.response.body
              end
            end
          end

          new_error = super(error, message)
          new_error.instance_variable_set(:@response_data, data)
          new_error.instance_variable_set(:@status_code, status_code)
          new_error.instance_variable_set(:@minor_error_code, minor_code)
          new_error
        end

        # Parse the response body for an error message
        #
        # @param [Hash] data the decoded XML response
        #
        # @return [String] the error message, if found, otherwise the raw data
        def self.extract_message(data)
          if data.is_a?(Hash)
            message = data[:message]
          end
          message || data.inspect
        end

        # Parse the response body for the minor error code
        #
        # @param [Hash] data the decoded XML response
        #
        # @return [String] the error minor error code, if found, otherwise nil
        def self.extract_minor_code(data)
          minor_code = nil
          if data.is_a?(Hash)
            minor_code = data[:minorErrorCode]
          end
          minor_code
        end
      end
    end
  end
end
