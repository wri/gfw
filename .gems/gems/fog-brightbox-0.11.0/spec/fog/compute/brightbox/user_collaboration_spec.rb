require "spec_helper"
require "fog/brightbox/models/compute/user_collaboration"

describe Fog::Compute::Brightbox::UserCollaboration do
  include ModelSetup

  subject { service.user_collaborations.new }

  describe "when asked for collection name" do
    it "responds 'user_collaborations'" do
      assert_equal "user_collaborations", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'user_collaboration'" do
      assert_equal "user_collaboration", subject.resource_name
    end
  end
end
