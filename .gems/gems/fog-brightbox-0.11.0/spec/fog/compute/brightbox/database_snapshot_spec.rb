require "spec_helper"
require "fog/brightbox/models/compute/database_snapshot"

describe Fog::Compute::Brightbox::DatabaseSnapshot do
  include ModelSetup
  include SupportsResourceLocking

  subject { service.database_snapshots.new }

  describe "when asked for collection name" do
    it "responds 'database_snapshots'" do
      assert_equal "database_snapshots", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'database_snapshot'" do
      assert_equal "database_snapshot", subject.resource_name
    end
  end
end
