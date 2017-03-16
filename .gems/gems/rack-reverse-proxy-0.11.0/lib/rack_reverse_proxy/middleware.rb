require "net/http"
require "net/https"
require "rack-proxy"
require "rack_reverse_proxy/roundtrip"

module RackReverseProxy
  # Rack middleware for handling reverse proxying
  class Middleware
    include NewRelic::Agent::Instrumentation::ControllerInstrumentation if defined? NewRelic

    def initialize(app = nil, &b)
      @app = app || lambda { |_| [404, [], []] }
      @rules = []
      @global_options = {
        :preserve_host => true,
        :preserve_encoding => false,
        :x_forwarded_headers => true,
        :matching => :all,
        :replace_response_host => false
      }
      instance_eval(&b) if block_given?
    end

    def call(env)
      RoundTrip.new(@app, env, @global_options, @rules).call
    end

    private

    def reverse_proxy_options(options)
      @global_options = options
    end

    def reverse_proxy(rule, url = nil, opts = {})
      if rule.is_a?(String) && url.is_a?(String) && URI(url).class == URI::Generic
        raise Errors::GenericURI.new, url
      end
      @rules << Rule.new(rule, url, opts)
    end
  end
end
