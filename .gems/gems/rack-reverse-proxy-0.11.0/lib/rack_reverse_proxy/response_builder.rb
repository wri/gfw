module RackReverseProxy
  # ResponseBuilder knows target response building process
  class ResponseBuilder
    def initialize(target_request, uri, options)
      @target_request = target_request
      @uri = uri
      @options = options
    end

    def fetch
      setup_response
      target_response
    end

    private

    def setup_response
      set_read_timeout
      handle_https
      handle_verify_mode
    end

    def set_read_timeout
      return unless read_timeout?
      target_response.read_timeout = options[:timeout]
    end

    def read_timeout?
      options[:timeout].to_i > 0
    end

    def handle_https
      return unless https?
      target_response.use_ssl = true
    end

    def https?
      "https" == uri.scheme
    end

    def handle_verify_mode
      return unless verify_mode?
      target_response.verify_mode = options[:verify_mode]
    end

    def verify_mode?
      options.key?(:verify_mode)
    end

    def target_response
      @_target_response ||= Rack::HttpStreamingResponse.new(
        target_request,
        uri.host,
        uri.port
      )
    end

    attr_reader :target_request, :uri, :options
  end
end
