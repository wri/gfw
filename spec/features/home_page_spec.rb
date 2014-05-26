require 'spec_helper'

feature 'Home page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit home page' do
    visit '/'
    expect(page).to have_content("Find out what is happening in forests right now")
  end

end
