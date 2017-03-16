require "spec_helper"
require "fog/brightbox/models/compute/database_type"

describe Fog::Compute::Brightbox::DatabaseType do
  include ModelSetup

  subject { service.database_types.new }

  describe "when asked for collection name" do
    it "responds 'database_types'" do
      assert_equal "database_types", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'database_type'" do
      assert_equal "database_type", subject.resource_name
    end
  end
end
