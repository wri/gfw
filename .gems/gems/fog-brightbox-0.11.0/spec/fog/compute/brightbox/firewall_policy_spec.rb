require "spec_helper"
require "fog/brightbox/models/compute/firewall_policy"

describe Fog::Compute::Brightbox::FirewallPolicy do
  include ModelSetup

  subject { service.firewall_policies.new }

  describe "when asked for collection name" do
    it "responds 'firewall_policies'" do
      assert_equal "firewall_policies", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'firewall_policy'" do
      assert_equal "firewall_policy", subject.resource_name
    end
  end
end
