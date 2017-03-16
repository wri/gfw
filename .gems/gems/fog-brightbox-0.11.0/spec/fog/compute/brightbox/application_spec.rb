require "spec_helper"
require "fog/brightbox/models/compute/application"

describe Fog::Compute::Brightbox::Application do
  include ModelSetup

  subject { service.applications.new }

  describe "when asked for collection name" do
    it "responds 'applications'" do
      assert_equal "applications", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'application'" do
      assert_equal "application", subject.resource_name
    end
  end
end
