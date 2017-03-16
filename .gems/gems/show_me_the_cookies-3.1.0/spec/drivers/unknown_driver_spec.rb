require 'spec_helper'
require 'shared_examples_for_api'

describe 'RackTest when rack-test adapter uninstalled', type: :feature do
  before(:each) do
    Capybara.current_driver = :rack_test
    ShowMeTheCookies.register_adapter(:rack_test, nil)
  end

  describe 'error messages' do
    it "should tell me I'm unsupported" do
      expect { get_me_the_cookies }.to raise_error(
        ShowMeTheCookies::UnknownDriverError
      )
    end
  end
end
