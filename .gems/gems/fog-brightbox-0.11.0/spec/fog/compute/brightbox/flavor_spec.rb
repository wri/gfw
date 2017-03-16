require "spec_helper"
require "fog/brightbox/models/compute/flavor"

describe Fog::Compute::Brightbox::Flavor do
  include ModelSetup

  subject { service.flavors.new }

  describe "when asked for collection name" do
    it "responds 'flavors'" do
      assert_equal "flavors", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'flavor'" do
      assert_equal "flavor", subject.resource_name
    end
  end
end
