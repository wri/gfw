require "xmlrpc/client"
require "nokogiri/xml/sax/document"
require "nokogiri/xml/sax/parser"

module Fog
  module XenServer
    class NokogiriStreamParser < XMLRPC::XMLParser::AbstractStreamParser
      def initialize
        @parser_class = Class.new(Nokogiri::XML::SAX::Document) do

          include XMLRPC::XMLParser::StreamParserMixin

          alias_method :start_element, :startElement
          alias_method :end_element,   :endElement
          alias_method :characters,    :character
          alias_method :cdata_block,   :character

          def parse(str)
            Nokogiri::XML::SAX::Parser.new(self).parse(str)
          end
        end
      end
    end
  end
end
