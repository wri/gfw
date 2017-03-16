require "spec_helper"
require "fog/brightbox/models/compute/server"

describe Fog::Compute::Brightbox::Server do
  include ModelSetup
  include SupportsResourceLocking

  subject { service.servers.new }

  describe "when asked for collection name" do
    it "responds 'servers'" do
      assert_equal "servers", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'server'" do
      assert_equal "server", subject.resource_name
    end
  end

  describe "when snapshotting withi no options" do
    it "returns the server" do
      skip if RUBY_VERSION < "1.9"

      stub_request(:post, "http://localhost/1.0/servers/srv-12345/snapshot").
        with(:query => hash_including(:account_id),
             :headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 202, :body => %q({"id": "srv-12345"}), :headers => {})

      @server = Fog::Compute::Brightbox::Server.new(:service => service, :id => "srv-12345")
      assert_kind_of Hash, @server.snapshot
    end
  end

  describe "when snapshotting with link option" do
    it "returns the new image" do
      skip if RUBY_VERSION < "1.9"

      link = "<https://api.gb1.brightbox.com/1.0/images/img-12345>; rel=snapshot"

      stub_request(:post, "http://localhost/1.0/servers/srv-12345/snapshot").
        with(:headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 202, :body => "{}", :headers => { "Link" => link })

      stub_request(:get, "http://localhost/1.0/images/img-12345").
        with(:query => hash_including(:account_id),
             :headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 200, :body => %q({"id": "img-12345"}))
      @server = Fog::Compute::Brightbox::Server.new(:service => service, :id => "srv-12345")
      assert_kind_of Fog::Compute::Brightbox::Image, @server.snapshot(true)
    end
  end
end
