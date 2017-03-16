require "spec_helper"
require "fog/brightbox/models/compute/load_balancer"

describe Fog::Compute::Brightbox::LoadBalancer do
  include ModelSetup
  include SupportsResourceLocking

  subject { service.load_balancers.new }

  describe "when asked for collection name" do
    it "responds 'load_balancers'" do
      assert_equal "load_balancers", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'load_balancer'" do
      assert_equal "load_balancer", subject.resource_name
    end
  end
end
