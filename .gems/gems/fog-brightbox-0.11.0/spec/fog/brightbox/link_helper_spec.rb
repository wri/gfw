require "spec_helper"

describe Fog::Brightbox::LinkHelper do
  describe "when initialized with an RFC5988 value" do
    before do
      @header = "<https://www.example.com/1.0/images/img-12345>; rel=snapshot"
      @helper = Fog::Brightbox::LinkHelper.new(@header)
    end

    it "can return identifier" do
      assert_equal "img-12345", @helper.identifier
    end

    it "can return URI" do
      assert_kind_of URI, @helper.uri
    end
  end
end
