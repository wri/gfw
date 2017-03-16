require "rack_reverse_proxy/response_builder"

module RackReverseProxy
  # FIXME: Enable them and fix issues during refactoring
  # rubocop:disable Metrics/ClassLength

  # RoundTrip represents one request-response made by rack-reverse-proxy
  # middleware.
  class RoundTrip
    def initialize(app, env, global_options, rules, response_builder_klass = ResponseBuilder)
      @app = app
      @env = env
      @global_options = global_options
      @rules = rules
      @response_builder_klass = response_builder_klass
    end

    def call
      return app.call(env) if rule.nil?
      return proxy_with_newrelic if new_relic?
      proxy
    end

    private

    attr_reader :app, :env, :global_options, :rules, :response_builder_klass

    def new_relic?
      global_options[:newrelic_instrumentation]
    end

    def proxy_with_newrelic
      perform_action_with_newrelic_trace(:name => action_name, :request => source_request) do
        proxy
      end
    end

    def action_name
      "#{action_path}/#{source_request.request_method}"
    end

    def action_path
      # Rack::ReverseProxy/foo/bar#GET
      source_request.path.gsub(%r{/\d+}, "/:id").gsub(%r{^/}, "")
    end

    def uri
      return @_uri if defined?(@_uri)
      @_uri = rule.get_uri(path, env, headers, source_request)
    end

    def options
      @_options ||= global_options.dup.merge(rule.options)
    end

    def https_redirect
      rewrite_uri(uri, source_request)
      uri.scheme = "https"
      [301, { "Location" => uri.to_s }, ""]
    end

    def need_https_redirect?
      options[:force_ssl] &&
        options[:replace_response_host] &&
        source_request.scheme == "http"
    end

    def target_request
      @_target_request ||= build_target_request
    end

    def target_request_headers
      @_target_request_headers ||= headers
    end

    def build_target_request
      Net::HTTP.const_get(
        source_request.request_method.capitalize
      ).new(uri.request_uri)
    end

    def preserve_host
      return unless options[:preserve_host]
      target_request_headers["HOST"] = host_header
    end

    def preserve_encoding
      return if options[:preserve_encoding]
      target_request_headers.delete("Accept-Encoding")
    end

    def host_header
      return uri.host if uri.port == uri.default_port
      "#{uri.host}:#{uri.port}"
    end

    def set_forwarded_headers
      return unless options[:x_forwarded_headers]
      target_request_headers["X-Forwarded-Host"] = source_request.host
      target_request_headers["X-Forwarded-Port"] = source_request.port.to_s
    end

    def initialize_http_header
      target_request.initialize_http_header(target_request_headers)
    end

    def set_basic_auth
      return unless need_basic_auth?
      target_request.basic_auth(options[:username], options[:password])
    end

    def need_basic_auth?
      options[:username] && options[:password]
    end

    def setup_body
      return unless can_have_body? && body?
      source_request.body.rewind
      target_request.body_stream = source_request.body
    end

    def can_have_body?
      target_request.request_body_permitted?
    end

    def body?
      source_request.body
    end

    def set_content_length
      target_request.content_length = source_request.content_length || 0
    end

    def set_content_type
      return unless content_type?
      target_request.content_type = source_request.content_type
    end

    def content_type?
      source_request.content_type
    end

    def target_response
      @_target_response ||= response_builder_klass.new(
        target_request,
        uri,
        options
      ).fetch
    end

    def response_headers
      @_response_headers ||= build_response_headers
    end

    def build_response_headers
      ["Transfer-Encoding", "Status"].inject(rack_response_headers) do |acc, header|
        acc.delete(header)
        acc
      end
    end

    def rack_response_headers
      Rack::Utils::HeaderHash.new(
        Rack::Proxy.normalize_headers(
          format_headers(target_response.headers)
        )
      )
    end

    def replace_location_header
      return unless need_replace_location?
      rewrite_uri(response_location, source_request)
      response_headers["Location"] = response_location.to_s
    end

    def response_location
      @_response_location ||= URI(response_headers["Location"])
    end

    def need_replace_location?
      response_headers["Location"] && options[:replace_response_host]
    end

    def setup_request
      preserve_host
      preserve_encoding
      set_forwarded_headers
      initialize_http_header
      set_basic_auth
      setup_body
      set_content_length
      set_content_type
    end

    def setup_response_headers
      replace_location_header
    end

    def rack_response
      [target_response.status, response_headers, target_response.body]
    end

    def proxy
      return app.call(env) if uri.nil?
      return https_redirect if need_https_redirect?

      setup_request
      setup_response_headers

      rack_response
    end

    def format_headers(headers)
      headers.inject({}) do |acc, (key, val)|
        formated_key = key.split("-").map(&:capitalize).join("-")
        acc[formated_key] = Array(val)
        acc
      end
    end

    def request_default_port?(req)
      [["http", 80], ["https", 443]].include?([req.scheme, req.port])
    end

    def rewrite_uri(uri, original_req)
      uri.scheme = original_req.scheme
      uri.host   = original_req.host
      uri.port   = original_req.port unless request_default_port?(original_req)
    end

    def source_request
      @_source_request ||= Rack::Request.new(env)
    end

    def rule
      return @_rule if defined?(@_rule)
      @_rule = find_rule
    end

    def find_rule
      return if matches.length < 1
      non_ambiguous_match
      matches.first
    end

    def path
      @_path ||= source_request.fullpath
    end

    def headers
      Rack::Proxy.extract_http_request_headers(source_request.env)
    end

    def matches
      @_matches ||= rules.select do |rule|
        rule.proxy?(path, headers, source_request)
      end
    end

    def non_ambiguous_match
      return unless ambiguous_match?
      raise Errors::AmbiguousMatch.new(path, matches)
    end

    def ambiguous_match?
      matches.length > 1 && global_options[:matching] != :first
    end
  end
end
