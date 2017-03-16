module Fog
  module RiakCS
    module Utils
      def configure_uri_options(options = {})
        @host       = options[:host]       || 'localhost'
        @persistent = options[:persistent] || true
        @port       = options[:port]       || 8080
        @scheme     = options[:scheme]     || 'http'
      end

      def riakcs_uri
        "#{@scheme}://#{@host}:#{@port}"
      end
    end
  end
end
