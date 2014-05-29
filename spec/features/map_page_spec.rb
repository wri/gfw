require 'spec_helper'

feature 'Map page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit map page' do
    visit '/map'
    expect(page).to have_css("div#map")
    expect(page).to have_css("div#filters li.filter.forest_change")
  end



end