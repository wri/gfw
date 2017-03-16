require "spec_helper"

module RackReverseProxy
  RSpec.describe ResponseBuilder do
    let(:options) { {} }
    let(:uri_opt) { { :uri => "http://example.org/hello/world" } }
    let(:request) { double("Request") }

    subject(:response) do
      ResponseBuilder.new(
        request,
        URI(uri_opt[:uri]),
        options
      ).fetch
    end

    it "is a Rack::HttpStreamingResponse" do
      expect(response).to be_a(Rack::HttpStreamingResponse)
    end

    it "sets up read timeout" do
      options[:timeout] = 42
      expect(response.read_timeout).to eq(42)
    end

    it "sets up ssl when needed" do
      uri_opt[:uri] = "https://example.org/hello/world"
      expect(response.use_ssl).to eq(true)
    end

    it "it is possible to change ssl verify mode" do
      mode = OpenSSL::SSL::VERIFY_NONE
      options[:verify_mode] = mode
      expect(response.verify_mode).to eq(mode)
    end
  end
end
