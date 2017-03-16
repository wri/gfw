module Fog
  module Brightbox
    # Rough implementation to extract Brightbox identifiers from RFC5988 Link headers
    #
    # @see https://tools.ietf.org/html/rfc5988
    #
    class LinkHelper
      # @param [String] header The value assigned to the Link header
      def initialize(header)
        @header = header
        @parsed = false
      end

      def identifier
        parse unless @parsed
        uri.path.split("/")[3]
      end

      def uri
        parse unless @parsed
        URI.parse(@link)
      end

      private

      def parse
        match = @header.match(/\A<([^>]*)>/)
        @link = match[1]
        @parsed = true
      end
    end
  end
end
