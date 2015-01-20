require 'net/http'
require 'net/https'

module Rack
  class ReverseProxy
    def initialize(app = nil, &b)
      @app = app || lambda {|env| [404, [], []] }
      @matchers = []
      @global_options = {:preserve_host => true, :matching => :all, :verify_ssl => true}
      instance_eval &b if block_given?
    end

    def call(env)
      rackreq = Rack::Request.new(env)
      matcher = get_matcher rackreq.fullpath
      return @app.call(env) if matcher.nil?

      uri = matcher.get_uri(rackreq.fullpath,env)
      all_opts = @global_options.dup.merge(matcher.options)
      headers = Rack::Utils::HeaderHash.new
      env.each { |key, value|
        if key =~ /HTTP_(.*)/ and not value.nil? and not value.empty?
          headers[$1] = value
        end
      }
      headers['HOST'] = uri.host if all_opts[:preserve_host]

      session = Net::HTTP.new(uri.host, uri.port)
      session.read_timeout=all_opts[:timeout] if all_opts[:timeout]

      session.use_ssl = (uri.scheme == 'https')
      if uri.scheme == 'https' && all_opts[:verify_ssl]
        session.verify_mode = OpenSSL::SSL::VERIFY_PEER
      else
        # DO NOT DO THIS IN PRODUCTION !!!
        session.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end
      session.start { |http|
        m = rackreq.request_method
        puts "Reverse Request Headers: #{headers.inspect}"
        case m
        when "GET", "HEAD", "DELETE", "OPTIONS", "TRACE"
          req = Net::HTTP.const_get(m.capitalize).new(uri.request_uri, headers)
          req.basic_auth all_opts[:username], all_opts[:password] if all_opts[:username] and all_opts[:password]
        when "PUT", "POST"
          req = Net::HTTP.const_get(m.capitalize).new(uri.request_uri, headers)
          req.basic_auth all_opts[:username], all_opts[:password] if all_opts[:username] and all_opts[:password]

          if rackreq.body.respond_to?(:read) && rackreq.body.respond_to?(:rewind)
            body = rackreq.body.read
            req.content_length = body.size
            rackreq.body.rewind
          else
            req.content_length = rackreq.body.size
          end

          req.content_type = rackreq.content_type unless rackreq.content_type.nil?
          req.body_stream = rackreq.body
        else
          raise "method not supported: #{m}"
        end

        body = ''
        res = http.request(req) do |res|
          res.read_body do |segment|
            body << segment
          end
        end

        [res.code, create_response_headers(res), [body]]
      }
    end

    private

    def get_matcher path
      matches = @matchers.select do |matcher|
        matcher.match?(path)
      end

      if matches.length < 1
        nil
      elsif matches.length > 1 && @global_options[:matching] != :first
        raise AmbiguousProxyMatch.new(path, matches)
      else
        matches.first
      end
    end

    def create_response_headers http_response
      headers = Hash[http_response.to_hash.collect{ |k,v| [k,v.first]}]
      response_headers = Rack::Utils::HeaderHash.new(headers)
      # handled by Rack
      response_headers.delete('status')
      # TODO: figure out how to handle chunked responses
      response_headers.delete('transfer-encoding')
      # TODO: Verify Content Length, and required Rack headers
      response_headers
    end


    def reverse_proxy_options(options)
      @global_options=options
    end

    def reverse_proxy matcher, url, opts={}
      raise GenericProxyURI.new(url) if matcher.is_a?(String) && url.is_a?(String) && URI(url).class == URI::Generic
      @matchers << ReverseProxyMatcher.new(matcher,url,opts)
    end
  end

  class GenericProxyURI < Exception
    attr_reader :url

    def intialize(url)
      @url = url
    end

    def to_s
      %Q(Your URL "#{@url}" is too generic. Did you mean "http://#{@url}"?)
    end
  end

  class AmbiguousProxyMatch < Exception
    attr_reader :path, :matches
    def initialize(path, matches)
      @path = path
      @matches = matches
    end

    def to_s
      %Q(Path "#{path}" matched multiple endpoints: #{formatted_matches})
    end

    private

    def formatted_matches
      matches.map {|matcher| matcher.to_s}.join(', ')
    end
  end

  class ReverseProxyMatcher
    def initialize(matching,url,options)
      @matching=matching
      @url=url
      @options=options
      @matching_regexp= matching.kind_of?(Regexp) ? matching : /^#{matching.to_s}/
    end

    attr_reader :matching,:matching_regexp,:url,:options

    def match?(path)
      match_path(path) ? true : false
    end

    def get_uri(path,env)
      _url=(url.respond_to?(:call) ? url.call(env) : url.clone)
      if _url =~/\$\d/
        match_path(path).to_a.each_with_index { |m, i| _url.gsub!("$#{i.to_s}", m) }
        URI(_url)
      else
        URI.join(_url, path)
      end
    end
    def to_s
      %Q("#{matching.to_s}" => "#{url}")
    end
    private
    def match_path(path)
      path.match(matching_regexp)
    end


  end
end
