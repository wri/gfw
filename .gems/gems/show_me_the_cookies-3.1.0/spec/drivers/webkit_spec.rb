require 'spec_helper'
require 'shared_examples_for_api'
require 'capybara-webkit'

Capybara::Webkit.configure do |config|
  config.allow_url("subdomain.lvh.me")
end

describe 'Webkit', type: :feature do
  before(:each) do
    Capybara.current_driver = :webkit
  end

  describe 'the testing rig' do
    it 'should load the sinatra app' do
      visit '/'
      expect(page).to have_content('Cookie setter ready')
    end
  end

  it_behaves_like 'the API'
end
