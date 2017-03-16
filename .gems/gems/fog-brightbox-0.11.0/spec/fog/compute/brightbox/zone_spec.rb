require "spec_helper"
require "fog/brightbox/models/compute/zone"

describe Fog::Compute::Brightbox::Zone do
  include ModelSetup

  subject { service.zones.new }

  describe "when asked for collection name" do
    it "responds 'zones'" do
      assert_equal "zones", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'zone'" do
      assert_equal "zone", subject.resource_name
    end
  end
end
