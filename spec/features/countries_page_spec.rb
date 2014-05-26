require 'spec_helper'

feature 'Countries page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit Countries page' do
    visit '/countries'
    expect(page).to have_selector("h1", text: "Select a country")
  end

  scenario 'after clicking Bhutan link' do
    visit '/countries'
    find('li#BTN').click_link('Bhutan')
    expect(page).to have_selector("h1", text: "Bhutan")
  end

end
