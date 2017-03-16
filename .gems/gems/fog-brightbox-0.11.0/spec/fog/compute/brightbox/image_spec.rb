require "spec_helper"
require "fog/brightbox/models/compute/image"

describe Fog::Compute::Brightbox::Image do
  include ModelSetup
  include SupportsResourceLocking

  subject { service.images.new }

  describe "when asked for collection name" do
    it "responds 'images'" do
      assert_equal "images", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'image'" do
      assert_equal "image", subject.resource_name
    end
  end
end
