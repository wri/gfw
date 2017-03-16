require "spec_helper"
require "fog/brightbox/models/compute/cloud_ip"

describe Fog::Compute::Brightbox::CloudIp do
  include ModelSetup

  subject { service.cloud_ips.new }

  describe "when asked for collection name" do
    it "responds 'cloud_ips'" do
      assert_equal "cloud_ips", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'cloud_ip'" do
      assert_equal "cloud_ip", subject.resource_name
    end
  end
end
