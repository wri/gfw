module Rack
  ##
  # Patch HttpStreamingResponse
  # in order to support webmocks and still use rack-proxy
  #
  # Inspired by @ehlertij commits on sportngin/rack-proxy:
  # 616574e452fa731f5427d2ff2aff6823fcf28bde
  # d8c377f7485997b229ced23c33cfef87d3fb8693
  # 75b446a26ceb519ddc28f38b33309e9a2799074c
  #
  class HttpStreamingResponse
    def each(&block)
      response.read_body(&block)
    ensure
      session.end_request_hacked unless mocking?
    end

    protected

    def response
      if mocking?
        @response ||= session.request(@request)
      else
        super
      end
    end

    def mocking?
      defined?(WebMock) || defined?(FakeWeb)
    end
  end
end
