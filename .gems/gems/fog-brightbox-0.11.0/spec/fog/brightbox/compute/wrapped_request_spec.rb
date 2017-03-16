require "spec_helper"

describe Fog::Compute::Brightbox do
  describe "#wrapped_request" do
    describe "when nested option passed as true" do
      before do
        @options = {
          :brightbox_client_id => "cli-12345",
          :brightbox_secret => "1234567890",
          :brightbox_access_token => "TESTVALUE"
        }
        @service = Fog::Compute::Brightbox.new(@options)
      end

      it "makes correct request" do
        stub_request(:get, "https://api.gb1.brightbox.com/1.0/accounts").
          with(:headers => {'Authorization'=>'Bearer TESTVALUE'},
               :query => { :nested => "true" }).
          to_return(:status => 200, :body => "", :headers => {})

        @service.wrapped_request("get", "/1.0/accounts", [200], :nested => "true")
        pass
      end
    end

    describe "when nested option passed as false" do
      before do
        @options = {
          :brightbox_client_id => "cli-12345",
          :brightbox_secret => "1234567890",
          :brightbox_access_token => "TESTVALUE"
        }
        @service = Fog::Compute::Brightbox.new(@options)
      end

      it "makes correct request" do
        stub_request(:get, "https://api.gb1.brightbox.com/1.0/accounts").
          with(:headers => {'Authorization'=>'Bearer TESTVALUE'},
               :query => { :nested => "false" }).
          to_return(:status => 200, :body => "", :headers => {})

        @service.wrapped_request("get", "/1.0/accounts", [200], :nested => "false")
        pass
      end
    end

    describe "when nested option not passed" do
      before do
        @options = {
          :brightbox_client_id => "cli-12345",
          :brightbox_secret => "1234567890",
          :brightbox_access_token => "TESTVALUE"
        }
        @service = Fog::Compute::Brightbox.new(@options)
      end

      it "makes correct request" do
        stub_request(:get, "https://api.gb1.brightbox.com/1.0/accounts").
          with(:headers => {'Authorization'=>'Bearer TESTVALUE'},
               :query => {}).
          to_return(:status => 200, :body => "", :headers => {})

        @service.wrapped_request("get", "/1.0/accounts", [200])
        pass
      end
    end
  end
end
