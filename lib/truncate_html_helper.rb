require "rexml/parsers/pullparser"

module TruncateHtmlHelper
  # raised when tags could not be fixed up by nokogiri
  class InvalidHtml < RuntimeError; end

  # you may set this to either 'html4', or 'xhtml1'
  mattr_accessor :flavor
  class << self
    alias_method :flavour=, :flavor=
    alias_method :flavour, :flavor
  end

  self.flavor = 'html4'

  # Truncates html respecting tags and html entities.
  #
  # The API is the same as ActionView::Helpers::TextHelper#truncate.  It uses Rexml for the parsing, and HtmlEntities for entity awareness.  If Rexml raises a ParseException, then Hpricot is used to fixup the tags, and we try again
  #
  # Examples:
  #  truncate_html '<p>Hello <strong>World</strong></p>', :length => 7 # => '<p>Hello <strong>W&hellip;</strong></p>'
  #  truncate_html '<p>Hello &amp; Goodbye</p>', :length => 7          # => '<p>Hello &amp;&hellip;</p>'
  def truncate_html(input, *args)
    # support both 2.2 & earlier APIs
    options = args.extract_options!
    length = options[:length] || args[0] || 30
    omission = options[:omission] || args[1] || '&hellip;'

    begin
      parser = REXML::Parsers::PullParser.new(input)
      encoder = HTMLEntities.new(TruncateHtmlHelper.flavor)
      tags, output, chars_remaining = [], '', length

      while parser.has_next? && chars_remaining > 0
        element = parser.pull
        case element.event_type
        when :start_element
          output << rexml_element_to_tag(element)
          tags.push element[0]
        when :end_element
          output << "</#{tags.pop}>"
        when :text
          text = encoder.decode(element[0])
          output << encoder.encode(text.first(chars_remaining))
          chars_remaining -= text.length
          output << omission if chars_remaining < 0
        end
      end

      tags.reverse.each {|tag| output << "</#{tag}>" }
      output

    rescue REXML::ParseException => e
      fixed_up = Nokogiri::HTML.fragment(input).to_html
      raise ::TruncateHtmlHelper::InvalidHtml, "Could not fixup invalid html. #{e.message}" if fixed_up == input
      input = fixed_up
      retry
    end
  end

private
  def rexml_element_to_tag(element)
    "<#{element[0]}#{element[1].inject(""){|m,(k,v)| m << %{ #{k}="#{v}"}} unless element[1].empty?}>"
  end
end
