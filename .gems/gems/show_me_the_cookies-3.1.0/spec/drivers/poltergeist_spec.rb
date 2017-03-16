require 'spec_helper'
require 'shared_examples_for_api'
require 'capybara/poltergeist'

describe 'Poltergeist', type: :feature do
  before(:each) do
    Capybara.current_driver = :poltergeist
  end

  describe 'the testing rig' do
    it 'should load the sinatra app' do
      visit '/'
      expect(page).to have_content('Cookie setter ready')
    end
  end

  describe 'get_me_the_cookie' do
    it 'reads httponly option' do
      visit '/set_httponly/foo/bar'
      expect(get_me_the_cookie('foo')).to include(
        name: 'foo', value: 'bar', httponly: true
      )
    end
  end

  it_behaves_like 'the API'
end
