require 'spec_helper'

describe Fission do
  describe "config" do
    it "should load a config object" do
      Fission.config.should be_a Fission::Config
    end
  end
end
