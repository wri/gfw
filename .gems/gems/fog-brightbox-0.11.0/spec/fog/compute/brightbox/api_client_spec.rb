require "spec_helper"
require "fog/brightbox/models/compute/api_client"

describe Fog::Compute::Brightbox::ApiClient do
  include ModelSetup

  subject { service.api_clients.new }

  describe "when asked for collection name" do
    it "responds 'api_clients'" do
      assert_equal "api_clients", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'api_client'" do
      assert_equal "api_client", subject.resource_name
    end
  end
end
