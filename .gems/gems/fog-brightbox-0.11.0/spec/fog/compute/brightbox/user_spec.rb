require "spec_helper"
require "fog/brightbox/models/compute/user"

describe Fog::Compute::Brightbox::User do
  include ModelSetup

  subject { service.users.new }

  describe "when asked for collection name" do
    it "responds 'users'" do
      assert_equal "users", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'user'" do
      assert_equal "user", subject.resource_name
    end
  end
end
