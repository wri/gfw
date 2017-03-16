require "spec_helper"
require "fog/brightbox/models/compute/event"

describe Fog::Compute::Brightbox::Event do
  include ModelSetup

  subject { service.events.new }

  describe "when asked for collection name" do
    it "responds 'events'" do
      assert_equal "events", subject.collection_name
    end
  end

  describe "when asked for resource name" do
    it "responds 'event'" do
      assert_equal "event", subject.resource_name
    end
  end
end
