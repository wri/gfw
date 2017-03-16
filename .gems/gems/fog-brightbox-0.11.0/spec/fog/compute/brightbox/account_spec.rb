require "spec_helper"
require "fog/brightbox/models/compute/account"

describe Fog::Compute::Brightbox::Account do
  include ModelSetup

  subject { service.accounts.new }

  describe "when asked for collection name" do
    it "responds 'accounts'" do
      assert_equal "accounts", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'account'" do
      assert_equal "account", subject.resource_name
    end
  end
end
