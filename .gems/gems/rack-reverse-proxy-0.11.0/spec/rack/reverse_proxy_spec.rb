require "spec_helper"

RSpec.describe Rack::ReverseProxy do
  include Rack::Test::Methods

  def app
    Rack::ReverseProxy.new
  end

  def dummy_app
    lambda { |_| [200, {}, ["Dummy App"]] }
  end

  let(:http_streaming_response) do
    double(
      "Rack::HttpStreamingResponse",
      :use_ssl= => nil,
      :verify_mode= => nil,
      :headers => {},
      :status => 200,
      :body => "OK"
    )
  end

  describe "as middleware" do
    def app
      Rack::ReverseProxy.new(dummy_app) do
        reverse_proxy "/test", "http://example.com/", :preserve_host => true
        reverse_proxy "/2test", lambda { |_| "http://example.com/" }
      end
    end

    it "forwards requests to the calling app when the path is not matched" do
      get "/"
      expect(last_response.body).to eq("Dummy App")
      expect(last_response).to be_ok
    end

    it "proxies requests when a pattern is matched" do
      stub_request(:get, "http://example.com/test").to_return(:body => "Proxied App")
      get "/test"
      expect(last_response.body).to eq("Proxied App")
    end

    it "produces a response header of type HeaderHash" do
      stub_request(:get, "http://example.com/test")
      get "/test"
      expect(last_response.headers).to be_an_instance_of(Rack::Utils::HeaderHash)
    end

    it "parses the headers as a Hash with values of type String" do
      stub_request(:get, "http://example.com/test").to_return(
        :headers => { "cache-control" => "max-age=300, public" }
      )
      get "/test"
      expect(last_response.headers["cache-control"]).to be_an_instance_of(String)
      expect(last_response.headers["cache-control"]).to eq("max-age=300, public")
    end

    it "proxies requests to a lambda url when a pattern is matched" do
      stub_request(:get, "http://example.com/2test").to_return(:body => "Proxied App2")
      get "/2test"
      expect(last_response.body).to eq("Proxied App2")
    end

    it "returns headers from proxied app as strings" do
      stub_request(:get, "http://example.com/test").to_return(
        :body => "Proxied App",
        :headers => { "Proxied-Header" => "TestValue" }
      )
      get "/test"
      expect(last_response.headers["Proxied-Header"]).to eq("TestValue")
    end

    it "sets the Host header w/o default port" do
      stub_request(:any, "example.com/test/stuff")
      get "/test/stuff"
      expect(
        a_request(:get, "http://example.com/test/stuff").with(
          :headers => { "Host" => "example.com" }
        )
      ).to have_been_made
    end

    it "sets the X-Forwarded-Host header to the proxying host by default" do
      stub_request(:any, "example.com/test/stuff")
      get "/test/stuff"
      expect(
        a_request(:get, "http://example.com/test/stuff").with(
          :headers => { "X-Forwarded-Host" => "example.org" }
        )
      ).to have_been_made
    end

    it "sets the X-Forwarded-Port header to the proxying port by default" do
      stub_request(:any, "example.com/test/stuff")
      get "/test/stuff"
      expect(
        a_request(:get, "http://example.com/test/stuff").with(
          :headers => { "X-Forwarded-Port" => "80" }
        )
      ).to have_been_made
    end

    it "does not produce headers with a Status key" do
      stub_request(:get, "http://example.com/2test").to_return(
        :status => 301, :headers => { :status => "301 Moved Permanently" }
      )

      get "/2test"

      headers = last_response.headers.to_hash
      expect(headers["Status"]).to be_nil
    end

    it "formats the headers correctly to avoid duplicates" do
      stub_request(:get, "http://example.com/2test").to_return(
        :headers => { :date => "Wed, 22 Jul 2015 11:27:21 GMT" }
      )

      get "/2test"

      headers = last_response.headers.to_hash
      expect(headers["Date"]).to eq("Wed, 22 Jul 2015 11:27:21 GMT")
      expect(headers["date"]).to be_nil
    end

    it "formats the headers with dashes correctly" do
      stub_request(:get, "http://example.com/2test").to_return(
        :status => 301,
        :headers => { :status => "301 Moved Permanently", :"x-additional-info" => "something" }
      )

      get "/2test"

      headers = last_response.headers.to_hash
      expect(headers["X-Additional-Info"]).to eq("something")
      expect(headers["x-additional-info"]).to be_nil
    end

    it "the response header includes content-length" do
      body = "this is the test body"
      stub_request(:any, "example.com/test/stuff").to_return(
        :body => body, :headers => { "Content-Length" => "10" }
      )
      get "/test/stuff"
      expect(last_response.headers["Content-Length"]).to eq(body.length.to_s)
    end

    it "does not include Accept-Encoding header" do
      stub_request(:any, "http://example.com/test")

      get "/test", {}, "HTTP_ACCEPT_ENCODING" => "gzip, deflate"

      expect(
        a_request(:get, "http://example.com/test").with(
          :headers => { "Accept-Encoding" => "gzip, deflate" }
        )
      ).not_to have_been_made

      expect(a_request(:get, "http://example.com/test")).to have_been_made
    end

    describe "with non-default port" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com:8080/"
        end
      end

      it "sets the Host header including non-default port" do
        stub_request(:any, "example.com:8080/test/stuff")
        get "/test/stuff"
        expect(
          a_request(:get, "http://example.com:8080/test/stuff").with(
            :headers => { "Host" => "example.com:8080" }
          )
        ).to have_been_made
      end
    end

    describe "with preserve host turned off" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com/", :preserve_host => false
        end
      end

      it "does not set the Host header" do
        stub_request(:any, "example.com/test/stuff")
        get "/test/stuff"

        expect(
          a_request(:get, "http://example.com/test/stuff").with(
            :headers => { "Host" => "example.com" }
          )
        ).not_to have_been_made

        expect(a_request(:get, "http://example.com/test/stuff")).to have_been_made
      end
    end

    describe "with preserve encoding turned on" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com/", :preserve_encoding => true
        end
      end

      it "sets the Accept-Encoding header" do
        stub_request(:any, "http://example.com/test")

        get "/test", {}, "HTTP_ACCEPT_ENCODING" => "gzip, deflate"

        expect(
          a_request(:get, "http://example.com/test").with(
            :headers => { "Accept-Encoding" => "gzip, deflate" }
          )
        ).to have_been_made
      end
    end

    describe "with x_forwarded_headers turned off" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy_options :x_forwarded_headers => false
          reverse_proxy "/test", "http://example.com/"
        end
      end

      it "does not set the X-Forwarded-Host header to the proxying host" do
        stub_request(:any, "example.com/test/stuff")
        get "/test/stuff"
        expect(
          a_request(:get, "http://example.com/test/stuff").with(
            :headers => { "X-Forwarded-Host" => "example.org" }
          )
        ).not_to have_been_made
        expect(a_request(:get, "http://example.com/test/stuff")).to have_been_made
      end

      it "does not set the X-Forwarded-Port header to the proxying port" do
        stub_request(:any, "example.com/test/stuff")
        get "/test/stuff"
        expect(
          a_request(:get, "http://example.com/test/stuff").with(
            :headers => { "X-Forwarded-Port" => "80" }
          )
        ).not_to have_been_made
        expect(a_request(:get, "http://example.com/test/stuff")).to have_been_made
      end
    end

    describe "with timeout configuration" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test/slow", "http://example.com/", :timeout => 99
        end
      end

      it "makes request with basic auth" do
        stub_request(:get, "http://example.com/test/slow")
        allow(Rack::HttpStreamingResponse).to receive(:new).and_return(http_streaming_response)
        expect(http_streaming_response).to receive(:read_timeout=).with(99)
        get "/test/slow"
      end
    end

    describe "without timeout configuration" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test/slow", "http://example.com/"
        end
      end

      it "makes request with basic auth" do
        stub_request(:get, "http://example.com/test/slow")
        allow(Rack::HttpStreamingResponse).to receive(:new).and_return(http_streaming_response)
        expect(http_streaming_response).not_to receive(:read_timeout=)
        get "/test/slow"
      end
    end

    describe "with basic auth turned on" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com/", :username => "joe", :password => "shmoe"
        end
      end

      it "makes request with basic auth" do
        stub_request(:get, "http://joe:shmoe@example.com/test/stuff").to_return(
          :body => "secured content"
        )
        get "/test/stuff"
        expect(last_response.body).to eq("secured content")
      end
    end

    describe "with preserve response host turned on" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com/", :replace_response_host => true
        end
      end

      it "replaces the location response header" do
        stub_request(:get, "http://example.com/test/stuff").to_return(
          :headers => { "location" => "http://test.com/bar" }
        )
        get "http://example.com/test/stuff"
        expect(last_response.headers["location"]).to eq("http://example.com/bar")
      end

      it "keeps the port of the location" do
        stub_request(:get, "http://example.com/test/stuff").to_return(
          :headers => { "location" => "http://test.com/bar" }
        )
        get "http://example.com:3000/test/stuff"
        expect(last_response.headers["location"]).to eq("http://example.com:3000/bar")
      end

      it "doesn't keep the port when it's default for the protocol" do
        # webmock doesn't allow to stub an https URI, but this is enough to
        # reply to the https code path
        stub_request(:get, "http://example.com/test/stuff").to_return(
          :headers => { "location" => "http://test.com/bar" }
        )
        get "https://example.com/test/stuff"
        expect(last_response.headers["location"]).to eq("https://example.com/bar")
      end
    end

    describe "with ambiguous routes and all matching" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy_options :matching => :all
          reverse_proxy "/test", "http://example.com/"
          reverse_proxy(%r{^/test}, "http://example.com/")
        end
      end

      it "raises an exception" do
        expect { get "/test" }.to raise_error(RackReverseProxy::Errors::AmbiguousMatch)
      end
    end

    # FIXME: descriptions are not consistent with examples
    describe "with ambiguous routes and first matching" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy_options :matching => :first
          reverse_proxy "/test", "http://example1.com/"
          reverse_proxy(%r{^/test}, "http://example2.com/")
        end
      end

      it "raises an exception" do
        stub_request(:get, "http://example1.com/test").to_return(:body => "Proxied App")
        get "/test"
        expect(last_response.body).to eq("Proxied App")
      end
    end

    describe "with force ssl turned on" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example1.com/",
                        :force_ssl => true, :replace_response_host => true
        end
      end

      it "redirects to the ssl version when requesting non-ssl" do
        stub_request(:get, "http://example1.com/test/stuff").to_return(:body => "proxied")
        get "http://example.com/test/stuff"
        expect(last_response.headers["Location"]).to eq("https://example.com/test/stuff")
      end

      it "does nothing when already ssl" do
        stub_request(:get, "http://example1.com/test/stuff").to_return(:body => "proxied")
        get "https://example.com/test/stuff"
        expect(last_response.body).to eq("proxied")
      end
    end

    describe "with a route as a regular expression" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy %r{^/test(/.*)$}, "http://example.com$1"
        end
      end

      it "supports subcaptures" do
        stub_request(:get, "http://example.com/path").to_return(:body => "Proxied App")
        get "/test/path"
        expect(last_response.body).to eq("Proxied App")
      end
    end

    describe "with a https route" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "https://example.com"
        end
      end

      it "makes a secure request" do
        stub_request(:get, "https://example.com/test/stuff").to_return(
          :body => "Proxied Secure App"
        )
        get "/test/stuff"
        expect(last_response.body).to eq("Proxied Secure App")
      end

      it "sets the Host header w/o default port" do
        stub_request(:any, "https://example.com/test/stuff")
        get "/test/stuff"
        expect(
          a_request(:get, "https://example.com/test/stuff").with(
            :headers => { "Host" => "example.com" }
          )
        ).to have_been_made
      end
    end

    describe "with a https route on non-default port" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "https://example.com:8443"
        end
      end

      it "sets the Host header including non-default port" do
        stub_request(:any, "https://example.com:8443/test/stuff")
        get "/test/stuff"
        expect(
          a_request(:get, "https://example.com:8443/test/stuff").with(
            :headers => { "Host" => "example.com:8443" }
          )
        ).to have_been_made
      end
    end

    describe "with a route as a string" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com"
          reverse_proxy "/path", "http://example.com/foo$0"
        end
      end

      it "appends the full path to the uri" do
        stub_request(:get, "http://example.com/test/stuff").to_return(:body => "Proxied App")
        get "/test/stuff"
        expect(last_response.body).to eq("Proxied App")
      end
    end

    describe "with a generic url" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "example.com"
        end
      end

      it "throws an exception" do
        expect { app }.to raise_error(RackReverseProxy::Errors::GenericURI)
      end
    end

    describe "with a matching route" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy "/test", "http://example.com/"
        end
      end

      %w(get head delete put post).each do |method|
        describe "and using method #{method}" do
          it "forwards the correct request" do
            stub_request(method.to_sym, "http://example.com/test").to_return(
              :body => "Proxied App for #{method}"
            )
            send(method, "/test")
            expect(last_response.body).to eq("Proxied App for #{method}")
          end

          if %w(put post).include?(method)
            it "forwards the request payload" do
              stub_request(
                method.to_sym,
                "http://example.com/test"
              ).to_return { |req| { :body => req.body } }
              send(method, "/test", :test => "test")
              expect(last_response.body).to eq("test=test")
            end
          end
        end
      end
    end

    describe "with a matching lambda" do
      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy lambda { |path| path.match(%r{^/test}) }, "http://lambda.example.org"
        end
      end

      it "forwards requests to the calling app when path is not matched" do
        get "/users"
        expect(last_response).to be_ok
        expect(last_response.body).to eq("Dummy App")
      end

      it "proxies requests when a pattern is matched" do
        stub_request(:get, "http://lambda.example.org/test").to_return(:body => "Proxied App")

        get "/test"
        expect(last_response.body).to eq("Proxied App")
      end
    end

    describe "with a matching class" do
      #:nodoc:
      class Matcher
        def self.match(path)
          return unless path =~ %r{^/(test|users)}
          Matcher.new
        end

        def url(path)
          return "http://users-example.com" + path if path.include?("user")
          "http://example.com" + path
        end
      end

      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy Matcher
        end
      end

      it "forwards requests to the calling app when the path is not matched" do
        get "/"
        expect(last_response.body).to eq("Dummy App")
        expect(last_response).to be_ok
      end

      it "proxies requests when a pattern is matched" do
        stub_request(:get, "http://example.com/test").to_return(:body => "Proxied App")
        stub_request(:get, "http://users-example.com/users").to_return(:body => "User App")

        get "/test"
        expect(last_response.body).to eq("Proxied App")

        get "/users"
        expect(last_response.body).to eq("User App")
      end
    end

    describe "with a matching class" do
      #:nodoc:
      class RequestMatcher
        attr_accessor :rackreq

        def initialize(rackreq)
          self.rackreq = rackreq
        end

        def self.match(path, _headers, rackreq)
          return nil unless path =~ %r{^/(test|users)}
          RequestMatcher.new(rackreq)
        end

        def url(path)
          return nil unless rackreq.params["user"] == "omer"
          "http://users-example.com" + path
        end
      end

      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy RequestMatcher
        end
      end

      it "forwards requests to the calling app when the path is not matched" do
        get "/"
        expect(last_response.body).to eq("Dummy App")
        expect(last_response).to be_ok
      end

      it "proxies requests when a pattern is matched" do
        stub_request(:get, "http://users-example.com/users?user=omer").to_return(
          :body => "User App"
        )

        get "/test", :user => "mark"
        expect(last_response.body).to eq("Dummy App")

        get "/users", :user => "omer"
        expect(last_response.body).to eq("User App")
      end
    end

    describe "with a matching class that accepts headers" do
      #:nodoc:
      class MatcherHeaders
        def self.match(path, headers)
          if path.match(%r{^/test}) && headers["ACCEPT"] && headers["ACCEPT"] == "foo.bar"
            MatcherHeaders.new
          end
        end

        def url(path)
          "http://example.com" + path
        end
      end

      def app
        Rack::ReverseProxy.new(dummy_app) do
          reverse_proxy MatcherHeaders, nil, :accept_headers => true
        end
      end

      it "proxies requests when a pattern is matched and correct headers are passed" do
        stub_request(:get, "http://example.com/test").to_return(
          :body => "Proxied App with Headers"
        )
        get "/test", {}, "HTTP_ACCEPT" => "foo.bar"
        expect(last_response.body).to eq("Proxied App with Headers")
      end

      it "does not proxy requests when a pattern is matched and incorrect headers are passed" do
        stub_request(:get, "http://example.com/test").to_return(
          :body => "Proxied App with Headers"
        )
        get "/test", {}, "HTTP_ACCEPT" => "bar.foo"
        expect(last_response.body).not_to eq("Proxied App with Headers")
      end
    end
  end

  describe "as a rack app" do
    it "responds with 404 when the path is not matched" do
      get "/"
      expect(last_response).to be_not_found
    end
  end
end
