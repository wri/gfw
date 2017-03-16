module RackReverseProxy
  module Errors
    # GenericURI indicates that url is too generic
    class GenericURI < Exception
      attr_reader :url

      def intialize(url)
        @url = url
      end

      def to_s
        %(Your URL "#{@url}" is too generic. Did you mean "http://#{@url}"?)
      end
    end

    # AmbiguousMatch indicates that path matched more than one endpoint
    class AmbiguousMatch < Exception
      attr_reader :path, :matches

      def initialize(path, matches)
        @path = path
        @matches = matches
      end

      def to_s
        %(Path "#{path}" matched multiple endpoints: #{formatted_matches})
      end

      private

      def formatted_matches
        matches.map(&:to_s).join(", ")
      end
    end
  end
end
