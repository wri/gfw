module Fog
  module RiakCS
    module MultipartUtils
      autoload :Headers, 'fog/riakcs/multipart_utils/headers'

      def parse(data, boundary)
        contents = data.match(end_boundary_regex(boundary)).pre_match rescue ""
        contents.split(inner_boundary_regex(boundary)).reject(&:empty?).map do |part|
          parse_multipart_section(part)
        end.compact
      end

      def extract_boundary(header_string)
        $1 if header_string =~ /boundary=([A-Za-z0-9\'()+_,-.\/:=?]+)/
      end

      private

      def end_boundary_regex(boundary)
        /\r?\n--#{Regexp.escape(boundary)}--\r?\n?/
      end

      def inner_boundary_regex(boundary)
        /\r?\n--#{Regexp.escape(boundary)}\r?\n/
      end

      def parse_multipart_section(part)
        headers = Headers.new
        if md = part.match(/\r?\n\r?\n/)
          body = md.post_match
          md.pre_match.split(/\r?\n/).each do |line|
            headers.parse(line)
          end

          if headers["content-type"] =~ /multipart\/mixed/
            boundary = extract_boundary(headers.to_hash["content-type"].first)
            parse(body, boundary)
          else
            {:headers => headers.to_hash, :body => body}
          end
        end
      end
    end
  end
end