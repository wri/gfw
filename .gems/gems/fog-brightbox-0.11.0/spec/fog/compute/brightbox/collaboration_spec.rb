require "spec_helper"
require "fog/brightbox/models/compute/collaboration"

describe Fog::Compute::Brightbox::Collaboration do
  include ModelSetup

  subject { service.collaborations.new }

  describe "when asked for collection name" do
    it "responds 'collaborations'" do
      assert_equal "collaborations", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'collaboration'" do
      assert_equal "collaboration", subject.resource_name
    end
  end
end
