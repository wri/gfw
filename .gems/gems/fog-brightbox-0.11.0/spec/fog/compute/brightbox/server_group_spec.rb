require "spec_helper"
require "fog/brightbox/models/compute/server_group"

describe Fog::Compute::Brightbox::ServerGroup do
  include ModelSetup

  subject { service.server_groups.new }

  describe "when asked for collection name" do
    it "responds 'server_groups'" do
      assert_equal "server_groups", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'server_group'" do
      assert_equal "server_group", subject.resource_name
    end
  end
end
