require "spec_helper"
require "fog/brightbox/models/compute/database_server"

describe Fog::Compute::Brightbox::DatabaseServer do
  include ModelSetup
  include SupportsResourceLocking

  subject { service.database_servers.new }

  describe "when asked for collection name" do
    it "responds 'database_servers'" do
      assert_equal "database_servers", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'database_server'" do
      assert_equal "database_server", subject.resource_name
    end
  end

  describe "when snapshotting withi no options" do
    it "returns the database server" do
      skip if RUBY_VERSION < "1.9"

      stub_request(:post, "http://localhost/1.0/database_servers/dbs-12345/snapshot").
        with(:query => hash_including(:account_id),
             :headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 202, :body => %q({"id": "dbs-12345"}), :headers => {})

      @database_server = Fog::Compute::Brightbox::DatabaseServer.new(:service => service, :id => "dbs-12345")
      assert @database_server.snapshot
    end
  end

  describe "when snapshotting with link option" do
    it "returns the new image" do
      skip if RUBY_VERSION < "1.9"

      link = "<https://api.gb1.brightbox.com/1.0/database_snapshots/dbi-12345>; rel=snapshot"

      stub_request(:post, "http://localhost/1.0/database_servers/dbs-12345/snapshot").
        with(:headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 202, :body => "{}", :headers => { "Link" => link })

      stub_request(:get, "http://localhost/1.0/database_snapshots/dbi-12345").
        with(:query => hash_including(:account_id),
             :headers => { "Authorization" => "Bearer FAKECACHEDTOKEN" }).
        to_return(:status => 200, :body => %q({"id": "dbs-12345"}))
      @database_server = Fog::Compute::Brightbox::DatabaseServer.new(:service => service, :id => "dbs-12345")
      assert_kind_of Fog::Compute::Brightbox::DatabaseSnapshot, @database_server.snapshot(true)
    end
  end
end
