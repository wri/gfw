module RackReverseProxy
  # Rule understands which urls need to be proxied
  class Rule
    # FIXME: It needs to be hidden
    attr_reader :options

    def initialize(spec, url = nil, options = {})
      @has_custom_url = url.nil?
      @url = url
      @options = options
      @spec = build_matcher(spec)
    end

    def proxy?(path, *args)
      matches(path, *args).any?
    end

    def get_uri(path, env, *args)
      Candidate.new(
        self,
        has_custom_url,
        path,
        env,
        matches(path, *args)
      ).build_uri
    end

    def to_s
      %("#{spec}" => "#{url}")
    end

    private

    attr_reader :spec, :url, :has_custom_url

    def matches(path, *args)
      Matches.new(
        spec,
        url,
        path,
        options[:accept_headers],
        has_custom_url,
        *args
      )
    end

    def build_matcher(spec)
      return /^#{spec}/ if spec.is_a?(String)
      return spec if spec.respond_to?(:match)
      return spec if spec.respond_to?(:call)
      raise ArgumentError, "Invalid Rule for reverse_proxy"
    end

    # Candidate represents a request being matched
    class Candidate
      def initialize(rule, has_custom_url, path, env, matches)
        @rule = rule
        @env = env
        @path = path
        @has_custom_url = has_custom_url
        @matches = matches

        @url = evaluate(matches.custom_url)
      end

      def build_uri
        return nil unless url
        raw_uri
      end

      private

      attr_reader :rule, :url, :has_custom_url, :path, :env, :matches

      def raw_uri
        return substitute_matches if with_substitutions?
        return just_uri if has_custom_url
        uri_with_path
      end

      def just_uri
        URI.parse(url)
      end

      def uri_with_path
        URI.join(url, path)
      end

      def evaluate(url)
        return unless url
        return url.call(env) if lazy?(url)
        url.clone
      end

      def lazy?(url)
        url.respond_to?(:call)
      end

      def with_substitutions?
        url =~ /\$\d/
      end

      def substitute_matches
        URI(matches.substitute(url))
      end
    end

    # Matches represents collection of matched objects for Rule
    class Matches
      # rubocop:disable Metrics/ParameterLists

      # FIXME: eliminate :url, :accept_headers, :has_custom_url
      def initialize(spec, url, path, accept_headers, has_custom_url, headers, rackreq, *_)
        @spec = spec
        @url = url
        @path = path
        @has_custom_url = has_custom_url
        @rackreq = rackreq

        @headers = headers if accept_headers
        @spec_arity = spec.method(spec_match_method_name).arity
      end

      def any?
        found.any?
      end

      def custom_url
        return url unless has_custom_url
        found.map do |match|
          match.url(path)
        end.first
      end

      def substitute(url)
        found.each_with_index.inject(url) do |acc, (match, i)|
          acc.gsub("$#{i}", match)
        end
      end

      private

      attr_reader :spec, :url, :path, :headers, :rackreq, :spec_arity, :has_custom_url

      def found
        @_found ||= find_matches
      end

      def find_matches
        Array(
          spec.send(spec_match_method_name, *spec_params)
        )
      end

      def spec_params
        @_spec_params ||= _spec_params
      end

      def _spec_params
        [
          path,
          headers,
          rackreq
        ][0...spec_param_count]
      end

      def spec_param_count
        @_spec_param_count ||= _spec_param_count
      end

      def _spec_param_count
        return 1 if spec_arity == -1
        spec_arity
      end

      def spec_match_method_name
        return :match if spec.respond_to?(:match)
        :call
      end
    end
  end
end
