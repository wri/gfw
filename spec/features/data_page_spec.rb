require 'spec_helper'

feature 'Data page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit Data page' do
    visit '/sources'
    expect(page).to have_selector("h1", text: "Data sources")
  end

  scenario 'after clicking Download by country link' do
    visit '/sources'
    find('.header_block__footer').click_link('Download by country')
    expect(page).to have_selector("h1", text: "Select a country")
  end

  scenario 'after clicking forest cover tab' do
    visit '/sources'
    find('.navigation_left').click_link('Forest cover')
    expect(page).to have_css("article#forest_cover.selected")
  end

end