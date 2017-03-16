require "minitest/autorun"
require "webmock/minitest"
require "fog/brightbox"

describe Fog::Brightbox::Storage::Connection do
  let(:config) { Fog::Brightbox::Config.new(settings) }
  let(:connection) { Fog::Brightbox::Storage::Connection.new(config) }
  let(:params) do
    { :path => "fnord", :expects => [200] }
  end
  let(:settings) do
    {
      :brightbox_client_id => "app-12345",
      :brightbox_secret => "1234567890",
      :brightbox_storage_management_url => "https://files.gb2.brightbox.com/v1/acc-12345"
    }
  end
  let(:valid_auth_token) { "01234567890abcdefghijklmnopqrstuvwxyz" }

  {
    400 => Excon::Errors::BadRequest,
    401 => Fog::Brightbox::Storage::AuthenticationRequired,
    402 => Excon::Errors::PaymentRequired,
    403 => Excon::Errors::Forbidden,
    404 => Fog::Storage::Brightbox::NotFound,
    405 => Excon::Errors::MethodNotAllowed,
    406 => Excon::Errors::NotAcceptable,
    407 => Excon::Errors::ProxyAuthenticationRequired,
    408 => Excon::Errors::RequestTimeout,
    409 => Excon::Errors::Conflict,
    410 => Excon::Errors::Gone,
    411 => Excon::Errors::LengthRequired,
    412 => Excon::Errors::PreconditionFailed,
    413 => Excon::Errors::RequestEntityTooLarge,
    414 => Excon::Errors::RequestURITooLong,
    415 => Excon::Errors::UnsupportedMediaType,
    416 => Excon::Errors::RequestedRangeNotSatisfiable,
    417 => Excon::Errors::ExpectationFailed,
    422 => Excon::Errors::UnprocessableEntity,
    # 500 => Excon::Errors::InternalServerError,
    501 => Excon::Errors::NotImplemented,
    502 => Excon::Errors::BadGateway,
    503 => Excon::Errors::ServiceUnavailable,
    504 => Excon::Errors::GatewayTimeout
  }.each do |status, error|
    describe "when request responds with #{status}" do
      it "raises #{error}" do
        stub_request(:get, "https://files.gb2.brightbox.com/v1/acc-12345/fnord").
          to_return(:status => status)
        assert_raises(error) { connection.request(params) }
      end
    end
  end
end
